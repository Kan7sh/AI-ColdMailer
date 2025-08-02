"use server";

type StringPair = [string, string];

export async function getAIEmail({
  prompt,
}: {
  prompt: string;
}): Promise<StringPair> {
  const HF_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY!;
  const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:cerebras";

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: HF_MODEL,
        }),
      }
    );

    console.log("1");
    if (!response.ok) {
      console.log("2");
      return ["", ""];
    }

    const result = await response.json();
    console.log(result);

    const text = result.choices?.[0]?.message?.content;
    if (!text) {
      console.log("3");
      return ["", ""];
    }

    console.log("Raw AI response:", text);

    // More robust JSON extraction
    let rawJson = "";

    // First, try to extract JSON from code blocks
    let jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      rawJson = jsonMatch[1].trim();
    } else {
      // Fallback: look for JSON-like structure
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        rawJson = text.substring(jsonStart, jsonEnd + 1);
      } else {
        rawJson = text.trim();
      }
    }

    // Clean up common malformed patterns
    rawJson = rawJson
      .replace(/^{\s*`\s*{/, "{") // Remove {\`{ pattern
      .replace(/}\s*`\s*}$/, "}") // Remove }`} pattern
      .replace(/^`+|`+$/g, "") // Remove leading/trailing backticks
      .trim();

    console.log("Cleaned JSON to parse:", rawJson);

    try {
      const parsed = JSON.parse(rawJson);

      // Validate that we have the expected structure
      if (typeof parsed === "object" && parsed.subject && parsed.body) {
        // Preserve line breaks and formatting in the body
        const formattedBody = parsed.body
          .replace(/\\n/g, "\n") // Convert \n to actual line breaks
          .replace(/\\t/g, "\t") // Convert \t to actual tabs
          .replace(/\\r/g, "\r") // Convert \r to carriage returns
          .replace(/\\"/g, '"') // Convert \" to actual quotes
          .replace(/\\\\/g, "\\"); // Convert \\ to single backslash

        return [parsed.subject, formattedBody];
      } else {
        console.error("Parsed JSON doesn't have expected structure:", parsed);
        return ["", ""];
      }
    } catch (e) {
      console.error(
        "Failed to parse JSON:\n",
        e,
        "\nTried to parse:\n",
        rawJson
      );

      // Last resort: try to extract subject and body manually using regex
      try {
        const subjectMatch = rawJson.match(/"subject":\s*"([^"]+)"/);
        const bodyMatch = rawJson.match(/"body":\s*"((?:[^"\\]|\\.)*)"/);

        if (subjectMatch && bodyMatch) {
          const formattedBody = bodyMatch[1]
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "\r")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\");

          return [subjectMatch[1], formattedBody];
        }
      } catch (regexError) {
        console.error("Regex extraction also failed:", regexError);
      }

      return ["", ""];
    }
  } catch (err) {
    console.error("Network or other error:", err);
    return ["", ""];
  }
}
