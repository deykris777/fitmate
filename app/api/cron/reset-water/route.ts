import { getSupabaseClient } from '@/lib/supabase-client';

export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // set glasses = 0 where logged_date = yesterday
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('water_logs')
      .update({ glasses: 0 })
      .eq('logged_date', yesterdayStr);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      message: 'Water logs reset',
      resetDate: yesterdayStr,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron reset-water error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to reset water logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
