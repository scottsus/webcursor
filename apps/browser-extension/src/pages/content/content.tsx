import { getGreeting } from "@src/lib/ai/api/get-greeting";
import { MAX_INT } from "@src/lib/env";
import { FlameIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Content() {
  const [isVisible, setIsVisible] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "k") {
        e.preventDefault();
        setIsVisible((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onClick = async () => {
    setIsPending(true);
    const aiGreeting = await getGreeting({ name: "Batman" });
    setGreeting(aiGreeting);
    setIsPending(false);
  };

  return (
    <div
      className="flex rounded-lg"
      style={{
        position: "fixed",
        top: "5vh",
        left: "5vw",
        pointerEvents: "auto",
        zIndex: MAX_INT,
        display: isVisible ? "flex" : "none",
        flexDirection: "column",
        backgroundColor: "#1F2123",
      }}
    >
      <div className="flex items-center transition-all hover:brightness-125">
        <FlameIcon size={42} color="orange" />
        <h1>Browser Extension</h1>
      </div>
      <p>AI Greeting: {greeting}</p>
      <button
        onClick={onClick}
        className="rounded-md"
        style={{
          width: "50%",
          backgroundColor: "#1e3a8a",
          border: "none",
          margin: "0 auto",
          padding: "10px 0",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.5 : 1.0,
        }}
        disabled={isPending}
      >
        <p className="font-bold" style={{ margin: 0 }}>
          Greet
        </p>
      </button>
    </div>
  );
}
