import { useChat } from "@ai-sdk/react";
import { SERVER_URL } from "@src/lib/env";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${SERVER_URL}/api/chat`,
  });

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          className="rounded-md"
          placeholder="Ask anything (⌘+L)"
          value={input}
          onChange={handleInputChange}
          style={{
            backgroundColor: "#212121",
            border: "1px solid #323232",
            resize: "none",
            padding: "1rem",
            minHeight: "8rem",
            width: "100%",
            margin: "auto 0 0",
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
