import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-client';

export async function GET(request: Request) {
  // Check authorization headers to verify it's the cron service
  const authHeader = request.headers.get('Authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Get all users
    const supabase = getSupabaseClient();
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id');

    if (error) {
      throw error;
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ success: true, usersProcessed: 0, message: 'No users found.' });
    }

    const { origin } = new URL(request.url);
    const generateEndpoint = `${origin}/api/generate-plan`;

    // 2. Loop through users and call generation endpoint
    // We want them to execute but doing all in parallel might hit rate limits.
    // For a small scale, sequential or batched are fine. We will run it sequentially here.
    let count = 0;
    for (const user of users) {
      try {
        await fetch(generateEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        count++;
      } catch (err) {
        console.error(`Failed to generate plan for user ${user.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, usersProcessed: count });
  } catch (error: any) {
    console.error('Error in generate-weekly-plans cron:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
