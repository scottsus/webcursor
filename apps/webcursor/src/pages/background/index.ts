console.log("background script loaded");

async function screenshot() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) {
      return;
    }

    await chrome.tabs.update(tab.id, { active: true });
    const screenshot = await chrome.tabs.captureVisibleTab();

    return { screenshot };
  } catch (error) {
    console.error("captureActiveTab:", error);
  }
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "SCREENSHOT") {
    screenshot().then((res) => {
      sendResponse({ ok: res ? true : false, screenshot: res?.screenshot });
    });

    return true;
  }
});
