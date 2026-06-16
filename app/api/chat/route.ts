import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const systemPrompt = `You are an AI Health Assistant providing educational guidance only, not medical diagnosis.

For every user message describing symptoms, respond using this structure:

*Possible Causes*
- list 2-4 possible causes

*Questions*
- list 1-2 relevant follow-up questions

*Recommended Action*
🟢 Self-care / 🟡 See a doctor / 🟠 Urgent care / 🔴 Emergency — choose one and briefly explain

*Safety Note*
This is educational guidance only, not a medical diagnosis.

If the user describes symptoms that could indicate a medical emergency (e.g. chest pain with shortness of breath, signs of stroke, severe bleeding, difficulty breathing), skip the structure and clearly tell them to call emergency services immediately.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  });

  const data = await response.json();
  console.log("Groq response:", JSON.stringify(data, null, 2));

  const text = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

  return NextResponse.json({ reply: text });
}