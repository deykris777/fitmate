import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { profile, recentSummary } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: 'Profile data is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      // Offline Mock Simulator
      const mockPlan = [
        { day: 'Monday', type: 'strength', focus: 'Chest & Triceps', exercises: [{ name: 'Pushups', sets: 3, reps: 15, rest_seconds: 60 }, { name: 'Dumbbell Bench Press', sets: 3, reps: 10, rest_seconds: 90 }], duration_minutes: 45 },
        { day: 'Tuesday', type: 'cardio', focus: 'Endurance', exercises: [{ name: 'Brisk Jog / Running', duration_minutes: 30 }], duration_minutes: 30 },
        { day: 'Wednesday', type: 'rest', focus: 'Active Recovery', exercises: [{ name: 'Light Stretching', duration_minutes: 15 }], duration_minutes: 15 },
        { day: 'Thursday', type: 'strength', focus: 'Back & Biceps', exercises: [{ name: 'Pull-ups or Lat Pulldowns', sets: 3, reps: 8, rest_seconds: 90 }, { name: 'Dumbbell Rows', sets: 3, reps: 12, rest_seconds: 60 }], duration_minutes: 45 },
        { day: 'Friday', type: 'cardio', focus: 'HIIT', exercises: [{ name: 'Jump Rope Intervals', sets: 10, reps: '1 min', rest_seconds: 30 }], duration_minutes: 20 },
        { day: 'Saturday', type: 'strength', focus: 'Legs & Core', exercises: [{ name: 'Squats', sets: 4, reps: 10, rest_seconds: 90 }, { name: 'Plank', sets: 3, reps: '60s', rest_seconds: 30 }], duration_minutes: 50 },
        { day: 'Sunday', type: 'flexibility', focus: 'Full Body Yoga', exercises: [{ name: 'Yoga Flow', duration_minutes: 40 }], duration_minutes: 40 }
      ];
      return NextResponse.json({ plan: mockPlan });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = `You are an expert personal trainer. Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences. Just the raw JSON array.`;

    const userPrompt = `Generate a 7-day workout plan.
User: goal=${profile.goal || 'general fitness'}, fitness_level=${profile.fitness_level || 'beginner'}, age=${profile.age || 'unknown'}
Recent training (avoid same muscle groups trained in last 48h): ${JSON.stringify(recentSummary || [])}
Rules:
- If user trained 3+ consecutive days, include a rest day
- Each element must have: { "day": "Monday", "type": "strength", "focus": "Chest & Triceps", "exercises": [{"name": "Pushups", "sets": 3, "reps": 10, "rest_seconds": 60}], "duration_minutes": 45 }
- type must be one of: strength, cardio, rest, flexibility
- Return exactly 7 objects, one per day starting Monday.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    
    let cleanJSON = responseText.trim();
    if (cleanJSON.startsWith('```json')) {
      cleanJSON = cleanJSON.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanJSON.startsWith('```')) {
      cleanJSON = cleanJSON.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const parsedPlan = JSON.parse(cleanJSON);

    return NextResponse.json({ plan: parsedPlan });
  } catch (error: any) {
    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error.message },
      { status: 500 }
    );
  }
}
