"use client";

import { useChat } from "@ai-sdk/react";
import { SERVER_URL } from "@src/lib/env";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${SERVER_URL}/api/chat`,
  });

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
      >
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} content={message.content} />
          ) : (
            <AssistantMessage key={message.id} content={message.content} />
          ),
        )}
      </div>

      <textarea
        name="prompt"
        className="rounded-md"
        placeholder="Ask anything (⌘+L)"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        style={{
          backgroundColor: "#212121",
          border: "1px solid #323232",
          resize: "none",
          padding: "1rem",
          minHeight: "8rem",
          width: "100%",
          marginTop: "auto",
          marginBottom: "0",
          color: "white",
          fontFamily: "Arial, sans-serif",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 0 0 1px #565656";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "none";
        }}
      />
    </form>
  );
}

function UserMessage({ content }: { content: string }) {
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
      <p style={{ margin: "0", fontSize: "14px" }}>{content}</p>
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
      <p style={{ margin: "0", fontSize: "14px", lineHeight: 1.4 }}>
        {content}
      </p>
    </div>
  );
}
