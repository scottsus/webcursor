import { getGreetingResponseSchema } from "@repo/ai-schemas";
import { claudeSonnet } from "~/src/lib/ai/clients/anthropic";
import { generateObject } from "ai";

const MAX_PROMPT_LEN = 150_000;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    if (!name) {
      throw new Error("missing name");
    }

    const { object } = await generateObject({
      model: claudeSonnet,
      system: "You love emojis. Given a name, produce a greeting.",
      messages: [
        {
          role: "user",
          content: name.slice(0, MAX_PROMPT_LEN),
        },
      ],
      schema: getGreetingResponseSchema,
    });

    return new Response(JSON.stringify({ greeting: object.greeting }), {
      status: 200,
    });
  } catch (err) {
    console.error("chooseAction:", err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
