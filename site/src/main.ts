import "./style.css";

async function handleDemoFormSubmit(e) {
  e.preventDefault();
  e.target.disabled = true;

  const domainEl = document.getElementById("domain") as HTMLInputElement | null;
  const domain = domainEl?.value;
  if (!domain) {
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
    const response = "Sorry, not ready yet";
    responseElement.textContent = JSON.stringify(response, null, 2);
    e.target.disabled = false;
  } catch (error) {
    responseElement.textContent = "Error: " + error.message;
    e.target.disabled = false;
  }
}

function init() {
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
