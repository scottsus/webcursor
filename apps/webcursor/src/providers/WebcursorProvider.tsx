import { useChat } from "@ai-sdk/react";
import {
  type ChatRequestOptions,
  type CreateMessage,
  type Message,
  type UIMessage,
} from "@ai-sdk/ui-utils";
import { DEV, SERVER_URL } from "@src/lib/env";
import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface WebcursorProvider {
  visibility: {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onShow: () => void;
    onHide: () => void;
    toggle: () => void;
  };

  textareaRef: RefObject<HTMLTextAreaElement>;
  highlight: {
    highlights: string[];
    clearHighlights: () => void;
  };

  vercelAiSdk: {
    messages: UIMessage[];
    input: string;
    handleInputChange: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    append: (
      message: Message | CreateMessage,
      chatRequestOptions?: ChatRequestOptions,
    ) => Promise<string | null | undefined>;
  };
}

const WebcursorContext = createContext<WebcursorProvider | undefined>(
  undefined,
);

export function WebcursorProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const [isVisible, setIsVisible] = useState(DEV ? true : false);
  const onShow = () => {
    setIsVisible(true);
    textareaRef.current?.focus();
  };
  const onHide = () => setIsVisible(false);
  const toggleVisibility = () => setIsVisible((v) => !v);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isFocusedOnTextArea = () => {
    let activeElement = document.activeElement;
    if (activeElement?.shadowRoot) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    const isTextareaFocused =
      activeElement === textareaRef.current ||
      textareaRef.current?.contains(activeElement);

    return isTextareaFocused;
  };

  const { messages, setMessages, input, handleInputChange, append } = useChat({
    api: `${SERVER_URL}/api/chat`,
  });
  const clearMessages = () => setMessages([]);

  const [selectedText, setSelectedText] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const addHighlight = (highlight: string) =>
    setHighlights((prev) => [...prev, highlight]);
  const clearHighlights = () => setHighlights([]);

  const getHighlightedText = () => {
    const highlightedText =
      selectedText ?? window.getSelection()?.toString().trim() ?? "";
    setSelectedText("");

    return highlightedText;
  };

  useEffect(() => {
    const handleMouseup = () => {
      const selection = window.getSelection()?.toString().trim() ?? "";
      if (selection) {
        setSelectedText(selection);
      }
    };

    window.addEventListener("mouseup", handleMouseup);

    return () => {
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  useEffect(() => {
    const handleCmdAposKeydown = (e: KeyboardEvent) => {
      if (e.metaKey && !e.shiftKey && e.key === "'") {
        e.preventDefault();

        const highlightedText = getHighlightedText();

        /**
         * 1. not visible, just add to chat and open chat
         */
        if (!isVisible) {
          if (highlightedText) {
            addHighlight(highlightedText);
          }
          onShow();
          return;
        }

        /**
         * 2. visible, no text highlighted & not focused, just reset
         */
        if (!highlightedText && !isFocusedOnTextArea()) {
          clearMessages();
          clearHighlights();
          return;
        }

        /**
         * 3. visible, not focused, text highlighted, add to chat
         */
        if (highlightedText) {
          addHighlight(highlightedText);
          return;
        }

        /**
         * 4. visible, focused, no text highlighted, close chat
         */
        if (isFocusedOnTextArea()) {
          onHide();
          return;
        }
      }
    };
    const handleEscapeKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onHide();
      }
    };

    window.addEventListener("keydown", handleCmdAposKeydown);
    window.addEventListener("keydown", handleEscapeKeydown);

    return () => {
      window.removeEventListener("keydown", handleCmdAposKeydown);
      window.removeEventListener("keydown", handleEscapeKeydown);
    };
  }, [messages, selectedText, isFocusedOnTextArea]);

  return (
    <WebcursorContext.Provider
      value={{
        visibility: {
          isVisible,
          setIsVisible,
          onShow,
          onHide,
          toggle: toggleVisibility,
        },
        textareaRef,
        highlight: {
          highlights,
          clearHighlights,
        },
        vercelAiSdk: {
          messages,
          input,
          handleInputChange,
          append,
        },
      }}
    >
      {children}
    </WebcursorContext.Provider>
  );
}

export function useWebcursor() {
  const context = useContext(WebcursorContext);
  if (context === undefined) {
    throw new Error(`useWebcursor must be used within a WebcursorProvider`);
  }

  return context;
}
