import { WebcursorProvider } from "@src/providers/WebcursorProvider";
import highlights from "highlight.js/styles/github-dark.css?inline";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import { Content } from "./content";
import styles from "./index.css?inline";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);

const shadowRoot = rootElement.attachShadow({ mode: "open" });

const appElement = document.createElement("div");
appElement.style.zIndex = "2147483647";
shadowRoot.appendChild(appElement);

// adapted from https://github.com/crxjs/chrome-extension-tools/discussions/727

const contentAppReset = document.createElement("style");
shadowRoot.append(contentAppReset);
contentAppReset.textContent = `:host {all: initial;}`;

const contentScriptStyles = document.createElement("style");
shadowRoot.append(contentScriptStyles);
contentScriptStyles.textContent = styles;

const highlightStyles = document.createElement("style");
shadowRoot.append(highlightStyles);
highlightStyles.textContent = highlights;

const toastElement = document.createElement("div");
document.body.appendChild(toastElement);
const toastRoot = createRoot(toastElement);

toastRoot.render(
  <Toaster
    position="top-center"
    toastOptions={{ style: { background: "white", padding: "16px" } }}
  />,
);

const root = createRoot(appElement);
root.render(
  <div style={{ fontFamily: "sans-serif" }}>
    <style type="text/css">{styles.toString()}</style>
    <WebcursorProvider>
      <Content />
    </WebcursorProvider>
  </div>,
);
