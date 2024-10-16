import "./style.css";
import { version } from "../../lib/index.ts";

document.addEventListener("DOMContentLoaded", () => {
  const versionEl = document.querySelector(".version");
  if (versionEl) versionEl.textContent = `v${version}`;
  console.log("version:", version);
});
