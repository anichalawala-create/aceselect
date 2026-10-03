import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";



const SYSTEM_PROMPT = `You are the Ace Select AI assistant, a highly knowledgeable, professional, and friendly representative for Ace Select, a premium 360° branding and advertising agency based in Mumbai.

Key Company Information:
- **Experience:** Over 18+ years of excellence in the branding and advertising industry.
- **Certification:** We are proudly ISO 9001:2015 certified, guaranteeing the highest quality standards.
- **Core Services:** 
  1. External Branding (storefronts, retail rollouts, signage)
  2. Internal Branding (workplace environments, office branding)
  3. Re-Branding (complete brand transformations)
  4. Brand Activation (events, promotions)
  5. Customized Gifts (corporate gifting)
  6. Safety Solutions
  7. CSR Activities
  8. Retail Store Roll Outs
- **Contact Info:** 
  - Phone: (+91) 22 25182233
  - Email: info@aceselect.in
  - Address: C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai – 400079
- **Technology:** We use a proprietary smart app to track project progress in real-time.

Guidelines:
- Keep your answers concise, helpful, and professional but approachable.
- Do not make up services we don't offer. If asked about something unrelated, politely guide them back to our core branding services.
- Use basic Markdown formatting for emphasis (e.g., bolding key terms).
- If the user asks for a quote or has a complex request, encourage them to email info@aceselect.in or use the Contact form.`;

function getGroqKey(): string | undefined {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, "utf-8").match(/^GROQ_API_KEY=(.*)$/m);
      if (match && match[1]?.trim()) return match[1].trim();
    }
  } catch {}
  return undefined;
}

export async function POST(req: Request) {
  try {
    const apiKey = getGroqKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages array" },
        { status: 400 }
      );
    }

    interface InputMessage {
      role?: string;
      content: string;
    }

    // Format messages for Groq API
    const formattedMessages: ChatCompletionMessageParam[] = messages.map((msg: InputMessage) => ({
      role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: msg.content,
    }));

    // Prepend system prompt
    formattedMessages.unshift({
      role: "system",
      content: SYSTEM_PROMPT,
    });

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I encountered an error generating a response.";

    return NextResponse.json({ text: responseText });
  } catch (error: unknown) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: String(error) },
      { status: 500 }
    );
  }
}
