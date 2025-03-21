"use client";

import { useWebcursor } from "@src/providers/WebcursorProvider";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import { takeScreenshot } from "./screenshot";

export function Chat() {
  const { textareaRef, vercelAiSdk, highlight } = useWebcursor();
  const { messages, input, handleInputChange, append } = vercelAiSdk;
  const { highlights, clearHighlights } = highlight;

  const handleSubmit = async () => {
    const message = `You are working with the context given in the attachment.

    Here are some text the user has highlighted:
    ${highlights.join("\n")}

    If giving code with code blocks, make sure to include triple backticks followed by the language name.
    This is important!

    Finally, the user is asking:
    <webcursor-user-query>${input}</webcursor-user-query>
    `;
    handleInputChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    clearHighlights();

    const attachment = await takeScreenshot();

    append(
      {
        role: "user",
        content: message,
      },
      { experimental_attachments: [attachment] },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "0.5rem",
          height: "85vh",
          overflow: "scroll",
          paddingBottom: "10vh",
        }}
      >
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} content={message.content} />
          ) : (
            <AssistantMessage key={message.id} content={message.content} />
          ),
        )}
      </div>

      <div
        className="rounded-md"
        style={{
          backgroundColor: "#212121",
          border: "1px solid #323232",
          marginTop: "auto",
          marginBottom: "0",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: 0,
        }}
      >
        {highlights.length > 0 && <UserSelection selections={highlights} />}
        <textarea
          name="prompt"
          ref={textareaRef}
          className="rounded-sm"
          placeholder="Ask anything (⌘+')"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
            if (!(e.key === "'" && (e.metaKey || e.ctrlKey))) {
              e.stopPropagation();
            }
          }}
          style={{
            border: "none",
            backgroundColor: "#212121",
            resize: "none",
            padding: "1rem",
            width: "100%",
            minHeight: "8rem",
            color: "white",
            fontFamily: "Arial, sans-serif",
            outline: "none",
          }}
          onFocus={() => {
            const container = textareaRef.current?.parentElement;
            if (container) container.style.boxShadow = "0 0 0 1px #565656";
          }}
          onBlur={() => {
            const container = textareaRef.current?.parentElement;
            if (container) container.style.boxShadow = "none";
          }}
        />
      </div>
    </form>
  );
}

function UserMessage({ content }: { content: string }) {
  const userQueryMatch = content.match(
    /<webcursor-user-query>(.*?)<\/webcursor-user-query>/s,
  );
  if (!userQueryMatch || userQueryMatch.length < 2) {
    throw new Error(`error parsing regex`);
  }
  const userQuery = userQueryMatch[1]?.trim();
  if (!userQuery) {
    throw new Error(`userQuery undefined`);
  }

  return (
    <div
      className="rounded-sm"
      style={{
        backgroundColor: "#212121",
        border: "1px solid #323232",
        display: "flex",
        flexDirection: "column",
        padding: "0.6rem",
        rowGap: "0.4rem",
      }}
    >
      <h3 style={{ margin: "0", fontSize: "14px" }}>User</h3>
      <p style={{ margin: "0", fontSize: "14px" }}>{userQuery}</p>
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "0.6rem",
        rowGap: "0.4rem",
      }}
    >
      <div
        className="assistant-message"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "0.6rem",
          rowGap: "0.4rem",
        }}
      >
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function UserSelection({ selections }: { selections: string[] }) {
  return (
    <div style={{ padding: "0.4rem", paddingBottom: "0" }}>
      <div
        className="rounded-sm"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#181818",
          width: "100%",
          padding: "0.4rem",
        }}
      >
        <p style={{ fontStyle: "italic", fontSize: "12px", margin: "0" }}>
          {selections.at(selections.length - 1)}
        </p>
        {selections.length > 1 && (
          <p
            style={{
              fontSize: "12px",
              padding: "0.2rem 1rem",
              margin: "0 0 0 auto",
            }}
          >
            and {selections.length - 1} other selection(s)...
          </p>
        )}
      </div>
    </div>
  );
}
