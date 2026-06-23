export const runtime = "edge";

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type ChatMessage = {
  role?: string;
  content?: unknown;
};

const getMessageText = (content: unknown) => {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (
          typeof part === "object" &&
          part !== null &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
};

const toGeminiRole = (role?: string) => {
  return role === "assistant" ? "model" : "user";
};

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json as {
    messages?: ChatMessage[];
    previewToken?: string;
  };
  const apiKey =
    previewToken || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "'messages' must be a non-empty array." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "GEMINI_API_KEY or GOOGLE_API_KEY is not configured.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const contents = messages
    .map((message) => {
      const text = getMessageText(message.content);

      if (!text) {
        return null;
      }

      return {
        role: toGeminiRole(message.role),
        parts: [{ text }],
      };
    })
    .filter(Boolean);

  if (contents.length === 0) {
    return new Response(
      JSON.stringify({ error: "No usable text was provided for Gemini." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const errorMessage =
      errorPayload?.error?.message || "Failed to generate an AI suggestion.";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await response.json();
  const suggestion = data?.candidates
    ?.flatMap((candidate: { content?: { parts?: Array<{ text?: string }> } }) =>
      candidate.content?.parts || [],
    )
    .map((part: { text?: string }) => part.text || "")
    .join("")
    .trim();

  if (!suggestion) {
    return new Response(
      JSON.stringify({ error: "Gemini did not return a suggestion." }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(suggestion, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
