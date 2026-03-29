import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { getUserProfile, getWorkoutHistory } from '@/lib/database';

export const maxDuration = 30;

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
  const { messages, userId } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No messages provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    // Return a mock streaming response when API key is missing
    const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
    
    let mockResponse = "";
    
    // Attempt BMI Regex parsing
    const weightMatch = lastUserMsg.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|lb|lbs)/i);
    const heightFeetMatch = lastUserMsg.match(/(\d+)\s*[':\s]+\s*(\d+)/i); // e.g. 5'7 or 5 7
    const heightCmMatch = lastUserMsg.match(/(\d+(?:\.\d+)?)\s*(cm)/i);
    
    let isBmi = false;
    
    if (weightMatch && (heightFeetMatch || heightCmMatch)) {
      isBmi = true;
      let weightKg = parseFloat(weightMatch[1]);
      if (weightMatch[2].toLowerCase().startsWith('lb')) {
        weightKg = weightKg * 0.453592;
      }
      
      let heightCm = 0;
      let heightStr = "";
      if (heightCmMatch) {
         heightCm = parseFloat(heightCmMatch[1]);
         heightStr = `${heightCm} cm`;
      } else if (heightFeetMatch) {
         const feet = parseFloat(heightFeetMatch[1]);
         const inches = parseFloat(heightFeetMatch[2]);
         heightCm = (feet * 12 + inches) * 2.54;
         heightStr = `${feet}'${inches}"`;
      }

      if (weightKg > 0 && heightCm > 0) {
        const bmi = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);
        const bmiNum = parseFloat(bmi);
        let category = "normal/healthy";
        let rangeRaw = "18.5 – 24.9";
        let recommendation = "So you're right in the middle—this is generally considered fit and balanced.";
        if (bmiNum < 18.5) { 
          category = "underweight"; rangeRaw = "< 18.5"; recommendation = "You might want to focus on a caloric surplus to build healthy mass."; 
        } else if (bmiNum >= 25 && bmiNum < 30) { 
          category = "overweight"; rangeRaw = "25.0 – 29.9"; recommendation = "You might want to focus on a slight caloric deficit and increased physical activity."; 
        } else if (bmiNum >= 30) {
          category = "obese"; rangeRaw = "> 30.0"; recommendation = "You may want to consult with a healthcare provider and focus on a structured weight loss plan."; 
        }

        mockResponse += `Based on what you shared:

*   **Weight**: ${weightMatch[1]} ${weightMatch[2]}
*   **Height**: ${heightStr} (~${Math.round(heightCm)} cm)

Your BMI (Body Mass Index) comes out to around **${bmi}**, which falls in the **${category} range** (${rangeRaw}).

👍 **What this means**

You are in a ${category} weight range. ${recommendation}

⚠️ **But remember**

Weight alone doesn't tell the full story. Health also depends on:
*   Muscle vs fat percentage
*   Fitness level (strength, stamina)
*   Diet and sleep habits

💡 **Simple check**

If you:
*   Feel energetic
*   Can do basic physical activity comfortably
*   Don't have major health issues

👉 Then you're likely doing well overall.

If you want, I can help you:
*   Get a lean/toned body plan
*   Or suggest a diet + workout routine based on your goal 💪`;
      }
    }
    
    if (!isBmi) {
      if (/\b(hello|hi|hey|greetings|morning|afternoon|evening)\b/.test(lastUserMsg)) {
        mockResponse += `**Hello there!** 👋 \n\nI'm your FitMate AI Coach! I am here to help you crush your specific fitness goals.\n\nWhat are we focusing on today?\n*   **Diet & Nutrition** (Macros, Calories, Meal Prep)\n*   **Strength Training** (Building muscle, Routines)\n*   **Conditioning** (Cardio, Weight Loss, Stamina)\n\nLet me know your priority!`;
      } else if (/\b(weight|lose|fat|cut|burn)\b/.test(lastUserMsg)) {
        mockResponse += `To achieve optimal weight loss and fat reduction, you need to systematically approach your energy balance. Here is the technical breakdown:

📉 **1. The Caloric Deficit**
*   You must consume fewer calories than your Total Daily Energy Expenditure (TDEE).
*   Target a deficit of **300-500 kcal** per day to lose roughly 0.5-1 lb per week sustainably without compromising muscle mass.

🥩 **2. Protein Preservation**
*   During a cut, your body is prone to catabolism (muscle breakdown).
*   Keep your protein intake high (**1.8-2.2g per kg of bodyweight**) to signal your body to retain muscle tissue.

🏃 **3. Training Modality**
*   **Keep Lifting**: Resistance training is crucial to maintain metabolic rate.
*   **NEAT (Non-Exercise Activity Thermogenesis)**: Increase your daily step count to 8k-10k steps.

Shall I calculate your baseline TDEE to get started? 😊`;
      } else if (/\b(muscle|gain|bulk|hypertrophy|strong|size)\b/.test(lastUserMsg)) {
        mockResponse += `Building lean muscle (hypertrophy) requires three non-negotiable pillars: Mechanical Tension, Caloric Surplus, and Recovery.

💪 **1. Progressive Overload**
*   You must expose your muscles to increasing levels of tension over time.
*   Focus on compound lifts: Squats, Deadlifts, Bench Press, Overhead Press.
*   Aim to increase weight, reps, or sets every 1-2 weeks.

🍽️ **2. Nutritional Surplus**
*   Eat in a slight caloric surplus (**200-300 kcal above maintenance**).
*   Ensure adequate protein (1.6-2.2g per kg of bodyweight) for muscle protein synthesis.

🛌 **3. Neuromuscular Recovery**
*   Muscles grow outside the gym, not inside! 
*   Aim for 7-9 hours of sleep and wait at least 48 hours before directly training the same muscle group again.

Would you like a sample Push/Pull/Legs split to kick off your bulk?`;
      } else if (/\b(fitness|workout|routine|exercise|plan)\b/.test(lastUserMsg)) {
        mockResponse += `To improve your overall fitness, you should focus on a structured and balanced approach. Here is a technical breakdown of how to optimize your routine:

**1. Resistance Training (Hypertrophy & Strength)**
*   **Frequency**: 3-4 days per week.
*   **Focus**: Compound movements like Squats, Deadlifts, Bench Presses, and Pull-ups.
*   **Volume**: 3-4 sets of 8-12 repetitions per muscle group to optimize time under tension.

**2. Cardiovascular Conditioning**
*   **LISS (Low-Intensity Steady State)**: 150 minutes per week (e.g., brisk walking, cycling) for basal heart health.
*   **HIIT (High-Intensity Interval Training)**: 1-2 sessions per week to boost metabolic rate and VO2 max.

**3. Recovery & Mobility**
*   **Sleep**: Aim for 7-9 hours of high-quality REM and deep sleep for neuromuscular recovery.
*   **Mobility**: Dedicate 10-15 minutes post-workout for dynamic and static stretching.

Would you like me to generate a personalized 4-day workout schedule based on these parameters?`;
      } else if (/\b(diet|food|protein|nutrition|calories|eat|meal)\b/.test(lastUserMsg)) {
        mockResponse += `Proper nutrition is the fundamental building block of any fitness goal. Here is a technical breakdown of optimal macronutrient distribution:

🥗 **Macronutrient Targets**
*   **Protein**: Aim for 1.6 to 2.2 grams per kilogram of body weight (0.8-1g per pound) to maximize muscle protein synthesis.
*   **Fats**: Should comprise 20-30% of your total daily caloric intake to support hormonal health (e.g., testosterone production).
*   **Carbohydrates**: Fill the remaining caloric balance with complex carbohydrates to fuel ATP production during intense workouts.

💧 **Hydration Protocol**
*   Consume at least 3-4 liters of water daily, scaling up based on workout intensity and sweat loss.

📊 **Implementation**
To lose body fat, you require a **Caloric Deficit** (~300-500 kcal under maintenance). To build muscle, you require a **Caloric Surplus** (~200-300 kcal over maintenance).

Would you like me to calculate your estimated TDEE (Total Daily Energy Expenditure)?`;
      } else {
        mockResponse += `*(Offline Mock Simulator)* \n\nI understand! To provide you with the most accurate, ChatGPT-style technical breakdown, I need to know more about your specific parameters.\n\nCould you clarify:\n1. Your primary fitness objective (e.g. Hypertrophy, Fat Loss, Endurance)?\n2. Your current training frequency?\n3. Any specific dietary restrictions?\n\nOnce you provide this, I can generate a highly detailed implementation protocol for you. 😊`;
      }
    }

    const stream = new ReadableStream({
      async start(controller) {
        // Use Array.from to correctly handle surrogate pairs for emojis
        const chars = Array.from(mockResponse);
        for (let i = 0; i < chars.length; i++) {
          controller.enqueue(new TextEncoder().encode(chars[i]));
          // Type faster for long responses
          if (i % 3 === 0) await new Promise(r => setTimeout(r, 1)); 
        }
        controller.close();
      }
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  try {
    let dynamicSystemPrompt = systemPrompt;
    if (userId) {
      try {
        const profile = await getUserProfile(userId);
        const workouts = await getWorkoutHistory(userId, 5);
        
        dynamicSystemPrompt += `\n\n--- USER CONTEXT ---\n`;
        dynamicSystemPrompt += `Name: ${profile?.full_name || 'User'}\n`;
        dynamicSystemPrompt += `Fitness Goal: ${profile?.fitness_goal || 'Not specified'}\n`;
        dynamicSystemPrompt += `Experience Level: ${profile?.experience_level || 'Not specified'}\n`;
        if (profile?.weight_kg) dynamicSystemPrompt += `Weight: ${profile.weight_kg} kg\n`;
        if (profile?.height_cm) dynamicSystemPrompt += `Height: ${profile.height_cm} cm\n`;
        
        if (workouts && workouts.length > 0) {
          dynamicSystemPrompt += `\nRecent Workouts (last 5):\n${workouts.map((w: any) => `- ${w.exercise_name || 'Workout'} (${w.duration_minutes} min, ${w.intensity} intensity)`).join('\n')}\n`;
        }
      } catch (err) {
        console.error('[v0] Failed to fetch user context for chat:', err);
      }
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: dynamicSystemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
