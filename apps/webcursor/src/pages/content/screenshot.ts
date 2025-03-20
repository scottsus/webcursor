import { type Attachment } from "@ai-sdk/ui-utils";

export async function takeScreenshot(): Promise<Attachment> {
  const res = await chrome.runtime.sendMessage({ action: "SCREENSHOT" });
  console.log("res:", res);
  const attachment: Attachment = {
    name: "screenshot.png",
    contentType: "image/png",
    url: res.screenshot,
  };

  return attachment;
}
