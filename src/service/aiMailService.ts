type StringPair = [string, string];
export async function getAIEmail({
  prompt,
}: {
  prompt: string;
}): Promise<StringPair> {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY!;
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
    if (!response.ok) {
      return ["", ""];
    }
    const result = await response.json();
    console.log(result);

    const text = result.choices?.[0]?.message?.content;
    if (!text) {
      return ["", ""];
    }

    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    if (!parsed) return ["", ""];

    return [parsed.subject, parsed.body];
  } catch (err) {
    console.error(err);
    return ["", ""];
  }
}
