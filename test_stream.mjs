import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({ apiKey: 'dummy-key' });

async function run() {
  try {
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [{role: 'user', content: 'hello'}]
    });
    for await (const text of result.textStream) {
      console.log(text);
    }
  } catch (e) {
    console.error('ERROR CATCHED:', e.message);
  }
}
run();
