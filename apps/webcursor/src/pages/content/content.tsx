import { useResizable } from "@src/hooks/use-resizable";
import { MAX_INT } from "@src/lib/env";
import { useWebcursor } from "@src/providers/WebcursorProvider";
import { useEffect } from "react";

import { Chat } from "./chat";

export function Content() {
  const { visibility, textareaRef } = useWebcursor();
  const { isVisible, onShow, onHide } = visibility;

  const { width, resizeHandleProps } = useResizable({
    isVisible,
    onShow,
    onHide,
  });

  useEffect(() => {
    if (isVisible) {
      textareaRef.current?.focus();

      document.body.style.paddingRight = `${width}vw`;
    } else {
      document.body.style.paddingRight = "0";
    }
  }, [isVisible, width]);

  return (
    <div
      className="flex rounded-lg"
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        width: isVisible ? `${width}vw` : "0",
        height: "100vh",
        pointerEvents: "auto",
        zIndex: MAX_INT,
        flexDirection: "column",
        backgroundColor: "#181818",
        padding: isVisible ? "0.5rem" : "0",
        color: "#FAFAFA",
        border: isVisible ? "2px solid #383838" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div {...resizeHandleProps} />
      <div className="flex items-center transition-all hover:brightness-125">
        <h1>✨ Webcursor</h1>
      </div>
      <Chat />
    </div>
  );
}
