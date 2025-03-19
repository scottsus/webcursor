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
    }
  }, [isVisible]);

  return (
    <div
      className="flex rounded-lg"
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        width: `${width}vw`,
        height: "100vh",
        pointerEvents: "auto",
        zIndex: MAX_INT,
        display: isVisible ? "flex" : "none",
        flexDirection: "column",
        backgroundColor: "#181818",
        padding: "0.5rem",
        color: "#FAFAFA",
        border: "2px solid #383838",
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
