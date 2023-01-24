function parseTable(table: HTMLTableElement) {
  const columns = table.querySelectorAll(
    "thead th, tbody th"
  ) as NodeListOf<HTMLTableCellElement>;
  const rows = table.querySelectorAll(
    "tbody tr:has(td)"
  ) as NodeListOf<HTMLTableRowElement>;

  const columnsData: string[] = [];
  const rowsData: string[][] = [];

  columns.forEach((column) => columnsData.push(column.innerText));
  rows.forEach((row) => {
    const rowData: string[] = [];
    row.querySelectorAll("td").forEach((cell) => rowData.push(cell.innerText));
    rowsData.push(rowData);
  });

  return [columnsData, ...rowsData];
}

function createElementFromString(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.firstChild as any;
}

function getCurrentTabID() {
  return new Promise((resolve, reject) => {
    try {
      console.log("get:tabId");
      chrome?.runtime?.sendMessage({ command: "get:tabId" }, (response) => {
        if (!chrome?.runtime?.lastError) {
          resolve(response.tabId);
        } else {
        }
      });
    } catch (err) {
      reject();
    }
  });
}

function addLoader(table: HTMLTableElement) {
  const container = table.querySelector(
    "caption.gpt3 > div"
  ) as HTMLTableCaptionElement;

  if (container) {
    const loader =
      createElementFromString(`<div style="z-index: 1;display: flex; position: absolute; left: 0; top: 0; width: 100%; height:100%;">
<div style="position: absolute;left: 0; top: 0; width: 100%; height:100%; background:#00000080"></div>
<div style="margin: auto;display: flex;align-items: center;">
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="12" viewBox="0 0 80 12" overflow="visible" fill="#fecb2f"><defs> <circle id="inline" cx="6" cy="6" r="6"></circle>    </defs> <use xlink:href="#inline" x="0"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0s" repeatCount="indefinite"></animate> <animateTransform attributeName="transform" type="translate" additive="sum" dur="1s" begin="0s" repeatCount="indefinite" from="0 0" to="10"></animateTransform>   </use><use xlink:href="#inline" x="20"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.25s" repeatCount="indefinite"></animate> <animateTransform attributeName="transform" type="translate" additive="sum" dur="1s" begin="0.25s" repeatCount="indefinite" from="0 0" to="10"></animateTransform>   </use><use xlink:href="#inline" x="40"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.5s" repeatCount="indefinite"></animate> <animateTransform attributeName="transform" type="translate" additive="sum" dur="1s" begin="0.5s" repeatCount="indefinite" from="0 0" to="10"></animateTransform>   </use><use xlink:href="#inline" x="60"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.75s" repeatCount="indefinite"></animate> <animateTransform attributeName="transform" type="translate" additive="sum" dur="1s" begin="0.75s" repeatCount="indefinite" from="0 0" to="10"></animateTransform>   </use> </svg>
</div>
</div>`);

    container.append(loader);
  }
}

function addTableAnalyzeElement(
  table: HTMLTableElement,
  onClick: (this: HTMLButtonElement, ev: MouseEvent) => any
) {
  let caption = table.querySelector("caption.gpt3") as HTMLTableCaptionElement;

  if (!caption) {
    caption = document.createElement("caption");
    caption.classList.add("gpt3");
  } else {
    caption.firstChild?.remove();
  }

  const svg: SVGAElement =
    createElementFromString(`<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="margin: auto 0; margin-right: 12px;"
    >
<circle cx="15.0793" cy="15.5007" r="15.0209" fill="#FECB2F"/>
<g clip-path="url(#clip0_29_29677)">
<path d="M5.61622 6.73852H18.2337C18.7118 6.73852 19.1703 6.91053 19.5083 7.21673C19.8463 7.52292 20.0363 7.9382 20.0363 8.37122V14.151C18.6803 13.9446 17.2884 14.2131 16.1428 14.902H12.8262V18.1674H13.7996C13.7005 18.7226 13.7005 19.2695 13.7996 19.8001H5.61622C5.13817 19.8001 4.6797 19.6281 4.34166 19.3219C4.00363 19.0157 3.81372 18.6005 3.81372 18.1674V8.37122C3.81372 7.47323 4.62485 6.73852 5.61622 6.73852ZM5.61622 10.0039V13.2693H11.0237V10.0039H5.61622ZM12.8262 10.0039V13.2693H18.2337V10.0039H12.8262ZM5.61622 14.902V18.1674H11.0237V14.902H5.61622Z" fill="#001514"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.0363 15.7926C17.5928 15.7926 15.612 17.5868 15.612 19.8001C15.612 22.0134 17.5928 23.8077 20.0363 23.8077C22.4798 23.8077 24.4606 22.0134 24.4606 19.8001C24.4606 17.5868 22.4798 15.7926 20.0363 15.7926ZM14.6288 19.8001C14.6288 17.095 17.0498 14.902 20.0363 14.902C23.0228 14.902 25.4438 17.095 25.4438 19.8001C25.4438 22.5053 23.0228 24.6982 20.0363 24.6982C17.0498 24.6982 14.6288 22.5053 14.6288 19.8001Z" fill="#001514"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.0654 19.8001C14.0654 16.8241 16.731 14.3991 20.0362 14.3991C23.3414 14.3991 26.007 16.8241 26.007 19.8001C26.007 22.7762 23.3414 25.2012 20.0362 25.2012C16.731 25.2012 14.0654 22.7762 14.0654 19.8001ZM20.0362 16.2955C17.9114 16.2955 16.1752 17.8577 16.1752 19.8001C16.1752 21.7425 17.9114 23.3047 20.0362 23.3047C22.161 23.3047 23.8973 21.7425 23.8973 19.8001C23.8973 17.8577 22.161 16.2955 20.0362 16.2955Z" fill="#001514"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.0362 23.0655C19.5385 23.0655 19.135 22.8219 19.135 22.5213L19.135 20.3444C19.135 20.0438 19.5385 19.8001 20.0362 19.8001C20.534 19.8001 20.9375 20.0438 20.9375 20.3444L20.9375 22.5213C20.9375 22.8219 20.534 23.0655 20.0362 23.0655Z" fill="#001514"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.9375 18.1674C20.9375 18.6183 20.536 18.9838 20.0407 18.9838L20.0318 18.9838C19.5365 18.9838 19.135 18.6183 19.135 18.1674C19.135 17.7166 19.5365 17.3511 20.0318 17.3511L20.0407 17.3511C20.536 17.3511 20.9375 17.7166 20.9375 18.1674Z" fill="#001514"/>
</g>
<defs>
<clipPath id="clip0_29_29677">
<rect width="22.5313" height="18.7761" fill="white" transform="translate(3.81372 6.73852)"/>
</clipPath>
</defs>
</svg>`);

  const container = document.createElement("div");
  container.setAttribute(
    "style",
    "padding: 12px; text-align: left; display: flex; margin: auto 0; position: relative;"
  );

  const captionText = document.createElement("div");
  captionText.setAttribute("style", "margin: auto 0;");
  captionText.innerText =
    "Table available for captioning with AccessibleTables extension.";

  const executeButton = document.createElement("button");
  executeButton.innerText = "Analyze Table Now";
  executeButton.setAttribute(
    "style",
    "background:#FECB2F;padding: 8px 12px;border-radius: 12px; border:none; margin: auto 0; margin-left: auto; cursor:pointer;"
  );
  executeButton.addEventListener("click", onClick);

  container.appendChild(svg);
  container.appendChild(captionText);
  container.appendChild(executeButton);

  caption.append(container);
  table.prepend(caption);
}

function addTableDescriptionElement(
  table: HTMLTableElement,
  description: string
) {
  let caption = table.querySelector("caption.gpt3") as HTMLTableCaptionElement;

  if (!caption) {
    caption = document.createElement("caption");
    caption.classList.add("gpt3");
    caption.setAttribute("styles", "position: relative;");
  } else {
    caption.firstChild?.remove();
  }

  const container = document.createElement("div");
  container.setAttribute(
    "style",
    "padding: 12px; text-align: left; display: flex; margin: auto 0;"
  );

  const captionText = document.createElement("div");
  captionText.setAttribute("style", "margin: auto 0;");
  captionText.innerText = description;

  const svg: SVGElement =
    createElementFromString(`<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"
    style="margin: auto 0; margin-right: 12px;"
    >
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FECB2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.0098 16L12.0098 12" stroke="#FECB2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.0098 8L11.9998 8" stroke="#FECB2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

  container.append(svg);
  container.append(captionText);

  caption.append(container);

  table.prepend(caption);
  table.setAttribute("summary", description);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const tables = document.querySelectorAll(
    "table:has(th)"
  ) as NodeListOf<HTMLTableElement>;

  switch (request.command) {
    case "get:count":
      sendResponse({
        count: tables.length,
      });
      break;
    case "add:analyzebutton":
      tables.forEach((table, i) => {
        addTableAnalyzeElement(table, () => {
          addLoader(table);
          getCurrentTabID().then((tabId) => {
            if (tabId) {
              try {
                console.log("analyze:table");
                chrome?.runtime?.sendMessage(
                  {
                    command: "analyze:table",
                    tabId: tabId,
                    tableIndex: i,
                  },
                  () => {
                    if (!chrome?.runtime?.lastError) {
                    } else {
                    }
                  }
                );
              } catch (err) {}
            }
          });
        });
      });
      sendResponse({});
      break;
    case "get:tables":
      const data: string[][][] = [];

      tables.forEach((table, index) => {
        table.setAttribute("data-at-index", index.toString());
        data.push(parseTable(table));
      });

      sendResponse({ tables: data });
      break;
    case "set:description":
      const detail = request.data;
      const tableIndex = request.tableIndex;
      const table = tables[tableIndex];

      addTableDescriptionElement(table, detail);
      sendResponse({});
      break;
    case "set:descriptions":
      const details = request.data;

      tables.forEach((table, i) => {
        addTableDescriptionElement(table, details[i]);
      });
      sendResponse({});
      break;
  }
});
