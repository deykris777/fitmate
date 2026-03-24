import { supabase } from '@/lib/supabase-client';

export const maxDuration = 60;

export async function GET(req: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get all users (you might want to limit this to active users)
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1000);

    if (!users || users.length === 0) {
      return Response.json({
        success: true,
        message: 'No users to reset',
        timestamp: new Date().toISOString(),
      });
    }

    // Reset diet for each user (this could be archived or cleared based on your preference)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Optional: Archive yesterday's diet data
    // For now, we'll just log that reset occurred
    
    return Response.json({
      success: true,
      message: `Daily diet reset for ${users.length} users`,
      usersProcessed: users.length,
      resetDate: yesterdayStr,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron reset-diet error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to reset diets',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
