import { useEffect, useState } from "react";

const CURSOR_STYLE = "col-resize";

export function useResizable({
  initialWidth = 25,
  minWidth = 13,
  maxWidth = 50,
  onHide,
  onShow,
  isVisible = true,
}: {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onHide?: () => void;
  onShow?: () => void;
  isVisible?: boolean;
}) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;

    document.body.style.cursor = CURSOR_STYLE;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidthPx = document.body.clientWidth - e.clientX;
      const newWidthPercent = (newWidthPx / document.body.clientWidth) * 100;

      if (!isVisible && newWidthPercent >= minWidth && onShow) {
        onShow();
        setWidth(newWidthPercent);
      } else if (isVisible && newWidthPercent < minWidth && onHide) {
        onHide();
      } else if (isVisible) {
        const constrainedWidth = Math.min(
          Math.max(newWidthPercent, minWidth),
          maxWidth,
        );
        setWidth(constrainedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isResizing, minWidth, maxWidth, onHide, onShow, isVisible]);

  const startResize = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const resizeHandleProps = {
    onMouseDown: startResize,
    style: {
      cursor: CURSOR_STYLE,
      position: "absolute" as const,
      right: isVisible ? undefined : 0,
      left: isVisible ? 0 : undefined,
      top: 0,
      height: "100%",
      width: "8px",
      zIndex: 2147483647,
    },
    className: "absolute top-0 h-full",
  };

  return {
    width,
    isResizing,
    startResize,
    resizeHandleProps,
  };
}
