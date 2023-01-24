async function getAPIKey() {
  const { apikey } = await chrome?.storage?.session?.get(["apikey"]);
  return apikey;
}

async function getConfig() {
  const config = await chrome?.storage?.session?.get([
    "maxrows",
    "disabledurls",
    "analyzeonload",
  ]);

  const maxRows = parseInt(config.maxrows);
  let disabledURLs = [];
  const analyzeOnLoad = config.analyzeonload;

  try {
    disabledURLs = JSON.parse(config.disabledurls);
  } catch (err) {}

  return {
    maxRows,
    disabledURLs,
    analyzeOnLoad,
  };
}

async function isURLDisabled(url: string) {
  const config = await getConfig();

  return config.disabledURLs.includes(url);
}

async function queryDavinci(prompt: string): Promise<string> {
  const apikey = await getAPIKey();

  return fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${apikey}`,
    },
    method: "POST",
    body: JSON.stringify({
      echo: true,
      max_tokens: 200,
      model: "text-davinci-003",
      prompt,
      stop: ["Human:", "AI:"],
      temperature: 0.6,
    }),
  })
    .then((response) => response.json())
    .then((resp) => {
      return (resp.choices?.[0]?.text || "").replace("\n", "").trim();
    });
}

type ChatInteraction = {
  question: string;
  reply?: string;
};

async function queryDavinciChat(
  interactions: ChatInteraction[]
): Promise<ChatInteraction[]> {
  const completion = await queryDavinci(
    `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

    ${interactions
      .map(
        (i) => `Human: ${i.question}
AI: ${i.reply || ""}`
      )
      .join("\n")}`
  );

  return completion
    .split("Human:")
    .map((interaction) => {
      const [question, reply] = interaction.split("AI:");

      return {
        question: question.trim(),
        reply: (reply || "").trim(),
      };
    })
    .filter((row) => row.question && row.reply);
}

function getTableCount(tabId: number): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      console.log("get:count");
      chrome.tabs.sendMessage(
        tabId,
        { command: "get:count" },
        function (response) {
          if (!chrome.runtime.lastError) {
            resolve(response.count);
          } else {
            resolve(0);
          }
        }
      );
    } catch (err) {
      reject(0);
    }
  });
}

function getTabTables(tabId: number): Promise<string[][][]> {
  return new Promise((resolve, reject) => {
    try {
      console.log("get:tables");
      chrome.tabs.sendMessage(
        tabId,
        { command: "get:tables" },
        function (response) {
          if (!chrome.runtime.lastError) {
            resolve(response.tables);
          } else {
          }
        }
      );
    } catch (err) {
      reject([]);
    }
  });
}

async function getTableDescriptions(tables: string[][][]) {
  const config = await getConfig();

  return Promise.all(
    tables.map((table) =>
      queryDavinciChat([
        {
          question: `Given this dataset
    
    ${JSON.stringify(table.slice(0, config.maxRows || 100))}

    Give me a description about it
    `,
        },
      ])
    )
  ).then((queries) => {
    return queries.map((query) => query[0]?.reply || "");
  });
}

async function analyzeTables(tabId: number, tableIndex?: number) {
  if (tableIndex || tableIndex === 0) {
    const tables = await getTabTables(tabId);
    const table = tables[tableIndex];
    const descriptions = await getTableDescriptions([table]);

    console.log("get:description");
    chrome.tabs.sendMessage(
      tabId,
      {
        command: "set:description",
        tableIndex,
        data: descriptions[0],
      },
      () => {
        if (!chrome.runtime.lastError) {
        } else {
        }
      }
    );
  } else {
    const tables = await getTabTables(tabId);
    const descriptions = await getTableDescriptions(tables);

    console.log("set:description");
    chrome.tabs.sendMessage(
      tabId,
      { command: "set:descriptions", data: descriptions },
      () => {
        if (!chrome.runtime.lastError) {
        } else {
        }
      }
    );
  }
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  const config = await getConfig();

  if (changeInfo.status == "complete" && tab.active && tabId) {
    if (tab.url && !(await isURLDisabled(tab.url))) {
      if (config.analyzeOnLoad) {
        analyzeTables(tabId);
      } else {
        console.log("add:analyzebutton");
        chrome.tabs.sendMessage(tabId, { command: "add:analyzebutton" }, () => {
          if (!chrome.runtime.lastError) {
          } else {
          }
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.command) {
    case "analyze:tables":
      analyzeTables(request.tabId);
      sendResponse({});
      break;
    case "analyze:table":
      analyzeTables(request.tabId, request.tableIndex);
      sendResponse({});
      break;
    case "get:tabId":
      sendResponse({ tabId: sender?.tab?.id });
      sendResponse({});
      break;
  }
});
