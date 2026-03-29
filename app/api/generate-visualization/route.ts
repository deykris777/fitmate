import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const { userId, goal, daysLogged } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let afterBodyType = 'fit and healthy';
    if (goal === 'weight_loss') {
      afterBodyType = 'lean and toned';
    } else if (goal === 'muscle_gain') {
      afterBodyType = 'muscular and athletic';
    } else if (goal === 'endurance') {
      afterBodyType = 'lean athletic with high stamina physique';
    }

    const prompt = `A clean fitness app illustration of a person achieving their ${afterBodyType} goal, full body front view, flat design, dark background, purple accent colors, gender neutral silhouette style, no face details, motivational fitness art`;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output: any = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          negative_prompt: "realistic photo, human face, text",
          width: 512,
          height: 768
        }
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!imageUrl) {
        throw new Error('Failed to generate image');
    }

    // Return the prompt so the client can save it with its authenticated session
    return NextResponse.json({ imageUrl, prompt, daysLogged });
  } catch (error: any) {
    console.error('Visualization error full:', error);
    let message = 'Error generating visualization';
    
    if (error?.message) {
      if (error.message.includes('Insufficient credit')) {
        message = 'You have insufficient credit to run this model on Replicate. Go to https://replicate.com/account/billing#billing to purchase credit.';
      } else if (error.message.includes('{"title":')) {
        try {
          const jsonStr = error.message.substring(error.message.indexOf('{'));
          const parsed = JSON.parse(jsonStr);
          message = parsed.detail || parsed.title || message;
        } catch (e) {
          message = error.message;
        }
      } else {
        message = error.message;
      }
    } else if (error?.response?.data?.detail) {
      message = error.response.data.detail;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
