import "./style.css";
import { resolve } from "../../lib/index";
import { ALL } from "../../lib/providers";

async function handleDemoFormSubmit(e) {
  e.preventDefault();
  e.target.disabled = true;

  const domainEl = document.getElementById("domain") as HTMLInputElement | null;
  const name = domainEl?.value;
  if (!name) {
    console.error("Domain not found");
    e.target.disabled = false;
    return;
  }

  const recordTypeEl = document.getElementById(
    "record-type",
  ) as HTMLSelectElement | null;
  const recordType = recordTypeEl?.value;
  if (!recordType) {
    console.error("Record type not found");
    e.target.disabled = false;
    return;
  }

  const serverEl = document.getElementById(
    "server",
  ) as HTMLSelectElement | null;
  const server = serverEl?.value;
  if (!server) {
    console.error("Server not found");
    e.target.disabled = false;
    return;
  }

  const responseElement = document.getElementById(
    "response",
  ) as HTMLPreElement | null;
  if (!responseElement) {
    console.error("Response element not found");
    e.target.disabled = false;
    return;
  }
  responseElement.textContent = "Resolving...";

  try {
    const response = await resolve(server, name, recordType);
    responseElement.textContent = response; //JSON.stringify(response, null, 2);
    e.target.disabled = false;
  } catch (error) {
    responseElement.textContent = "Error: " + error.message;
    e.target.disabled = false;
  }
}

function init() {
  const serverSelectEl = document.getElementById(
    "server",
  ) as HTMLSelectElement | null;
  if (serverSelectEl) {
    ALL.forEach((server) => {
      const serverName = `
      ${server.provider} 
      ${server.familyFilter ? "👪" : ""}
      ${server.malwareFilter ? "🛡️" : ""}
      ${server.url}
      ${server.ipVersion === 4 ? "🌐4️⃣" : "🌐6️⃣"}
      ${server.ecs ? "🗺️" : ""}
      `;

      resolve(server.url, "example.com", "A")
        .then(() => {
          const option = document.createElement("option");
          option.value = server.url;
          option.textContent = serverName;
          serverSelectEl.appendChild(option);
        })
        .catch((error) => {
          console.error(`Error resolving ${server.url}: ${error.message}`);
        });
    });
  }

  const demoFormEl = document.getElementById(
    "dns-form",
  ) as HTMLFormElement | null;
  demoFormEl?.addEventListener("submit", handleDemoFormSubmit);
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
