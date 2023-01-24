import React from "react";
import { Button } from "./components/Button";
import { ButtonIcon } from "./components/ButtonIcon";
import { Header } from "./components/Header";
import { HeaderTitle } from "./components/HeaderTitle";
import { Indicator } from "./components/Indicator";
import { Section } from "./components/Section";
import { SectiontContent } from "./components/SectionContent";
import { SectiontTitle } from "./components/SectiontTitle";
import { TextInput } from "./components/TextInput";
import { Toggle } from "./components/Toggle";
import cog from "./assets/cog.svg";
import cogActive from "./assets/cog-active.svg";
import times from "./assets/times.svg";

function App() {
  const [showConfig, setShowConfig] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [apiKeyRequired, setApiKeyRequired] = React.useState<boolean>(false);
  const [maxRows, setMaxRows] = React.useState("10");
  const [currentURL, setCurrentURL] = React.useState("");
  const [currentTableCount, setCurrentTableCount] = React.useState(0);
  const [disabledURLs, setDisabledURLs] = React.useState<string[]>([]);
  const [analyzeOnLoad, setAnalyzeOnLoad] = React.useState(false);
  const [totalAnalyzedTables, setTotalAnalyzedTables] = React.useState(0);

  const updateTableCount = React.useCallback((tabId: number) => {
    chrome?.tabs?.sendMessage(tabId, { command: "get:count" }, (response) => {
      if (!chrome.runtime.lastError) {
        if (response) setCurrentTableCount(response.count);
      } else {
      }
    });
  }, []);

  React.useEffect(() => {
    chrome?.storage?.session
      ?.get([
        "apikey",
        "maxrows",
        "disabledurls",
        "analyzeonload",
        "analyzedtables",
      ])
      .then((response) => {
        setApiKey(response?.["apikey"] || "");
        setShowConfig(!response?.["apikey"]);
        setMaxRows(response?.["maxrows"] || "10");
        setAnalyzeOnLoad(response?.["analyzeonload"] || false);
        setTotalAnalyzedTables(response?.["analyzedtables"] || 0);

        try {
          setDisabledURLs(JSON.parse(response?.["disabledurls"] || "[]"));
        } catch (_) {
          setDisabledURLs([]);
        }
      }).catch(err => {
        setShowConfig(true);
      });

    chrome?.tabs?.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status == "complete" && tab.active && tabId) {
        setCurrentURL(tab.url || "");
        updateTableCount(tabId);
      }
    });

    chrome?.tabs?.query(
      { active: true, lastFocusedWindow: true, status: "complete" },
      (tabs) => {
        const tab = tabs[0];
        if (tab && tab.id) {
          setCurrentURL(tab.url || "");
          updateTableCount(tab.id);
        }
      }
    );
  }, []);

  const handleApiKeyChange = React.useCallback((value: string) => {
    setApiKey(value);
  }, []);

  const handleMaxRowsChange = React.useCallback((value: string) => {
    setMaxRows(value);
  }, []);

  const handleAnalyzeOnLoadChange = React.useCallback(() => {
    setAnalyzeOnLoad((analyzeOnLoad) => !analyzeOnLoad);
  }, []);

  const handleToggleShowConfig = React.useCallback(() => {
    setShowConfig((config) => !config);
  }, []);

  const handleClose = React.useCallback(() => {
    window.close();
  }, []);

  const handleInvalidInputs = React.useCallback(() => {
      const valid = !!apiKey.length
      if (!valid) {
        setShowConfig(true);
        setApiKeyRequired(true);
      } else {
        setApiKeyRequired(false);
      }
      return valid;
    },
    [apiKey]
  );

  const handleSaveSettings = React.useCallback(() => {
    const valid = handleInvalidInputs();
    if (!valid) return
      chrome?.storage?.session
        ?.set({
          apikey: apiKey,
          maxRows: maxRows,
          analyzeonload: analyzeOnLoad,
        })
        .then(() => {
          setShowConfig(false);
        });
  }, [apiKey, maxRows, analyzeOnLoad]);

  const isURLDisabled = React.useMemo(() => {
    return disabledURLs.includes(currentURL);
  }, [disabledURLs, currentURL]);

  const handleChangeDisabledUrl = React.useCallback(() => {
    let updatedUrls: string[] = [];
    if (isURLDisabled) {
      updatedUrls = disabledURLs.filter((url) => url !== currentURL);
    } else {
      updatedUrls = [...disabledURLs, currentURL];
    }
    chrome?.storage?.session
      ?.set({ disabledurls: JSON.stringify(updatedUrls) })
      .then(() => {
        setDisabledURLs(updatedUrls);
      });
  }, [isURLDisabled, disabledURLs, currentURL]);

  const handleAnalyzeNow = React.useCallback(() => {
    const valid = handleInvalidInputs();
    if (!valid) return;
    chrome?.tabs?.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.id && tab.active) {
        chrome?.runtime?.sendMessage(
          { command: "analyze:tables", tabId: tab.id },
          () => {
            if (!chrome?.runtime?.lastError) {
            } else {
            }
          }
        );
      }
    });
  }, [apiKey]);

  return (
    <div className="App">
      <Header>
        <HeaderTitle>GPT3 AccesibleTables</HeaderTitle>
        <ButtonIcon
          image={showConfig ? cogActive : cog}
          onClick={handleToggleShowConfig}
        />
        <ButtonIcon image={times} onClick={handleClose} />
      </Header>
      {showConfig && (
        <Section>
          <SectiontContent>
            <TextInput
              value={apiKey}
              onChange={handleApiKeyChange}
              inputRequired={apiKeyRequired}
            >
              API key{" "}
              <a
                target="_blank"
                href="https://beta.openai.com/account/api-keys"
              >
                Get your API key here
              </a>
            </TextInput>
          </SectiontContent>
          <SectiontContent>
            <TextInput value={maxRows} onChange={handleMaxRowsChange}>
              Max rows to process
            </TextInput>
          </SectiontContent>
          <SectiontContent>
            <Toggle value={analyzeOnLoad} onClick={handleAnalyzeOnLoadChange}>
              Analyze tables on load
            </Toggle>
          </SectiontContent>
          <SectiontContent align="right">
            <Button size="small" onClick={handleSaveSettings}>
              Save settings
            </Button>
          </SectiontContent>
        </Section>
      )}
      <Section>
        <SectiontTitle>Tables Found</SectiontTitle>
        <SectiontContent flex>
          <Indicator value={currentTableCount} label="On this page" />
          <Indicator value={totalAnalyzedTables} label="Analyzed" />
        </SectiontContent>
        <SectiontContent>
          <Toggle value={!isURLDisabled} onClick={handleChangeDisabledUrl}>
            <span>This page:</span>
            <span>{currentURL}</span>
          </Toggle>
        </SectiontContent>
        <SectiontContent>
          <Button size="big" fullWidth onClick={handleAnalyzeNow}>
            Analyze Tables Now
          </Button>
        </SectiontContent>
      </Section>
    </div>
  );
}

export default App;
