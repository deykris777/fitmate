import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are FitMate, an AI fitness companion designed to help users achieve their fitness goals. You provide:

1. **Personalized Workout Guidance**: Recommend exercises based on user fitness level, goals, and available equipment
2. **Nutrition Advice**: Provide balanced diet recommendations and meal planning tips
3. **Motivation & Support**: Encourage users to stay consistent with their fitness journey
4. **Form & Safety**: Explain proper exercise form to prevent injuries
5. **Progress Tracking**: Help interpret workout data and suggest adjustments
6. **Recovery Tips**: Advise on rest, stretching, and injury prevention

Always:
- Be encouraging and supportive
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Remember the user's fitness level and goals from context
- Suggest when professional advice might be needed

Never diagnose medical conditions or recommend stopping medications.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No messages provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
