import { getGreetingResponseSchema } from "@repo/ai-schemas";
import { SERVER_URL } from "@src/lib/env";
import { z } from "zod";

export async function getGreeting({ name }: { name: string }): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("name", name);

    const res = await fetch(`${SERVER_URL}/api/get-greeting`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error("non-2xx http status");
    }

    const data = (await res.json()) as z.infer<
      typeof getGreetingResponseSchema
    >;
    return data.greeting;
  } catch (err) {
    console.error("getGreeting:", err);
    return "";
  }
}
