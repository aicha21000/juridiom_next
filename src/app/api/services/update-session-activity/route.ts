import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { sessionId, files } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }
    const db = firebaseAdmin.database();
    
    // Save to temp_sessions instead of orders to avoid polluting the dashboard
    const sessionRef = db.ref(`temp_sessions/${sessionId}`);
    await sessionRef.update({
        lastActivity: new Date().toISOString(),
        ...(files ? { files } : {})
    });
    
    return NextResponse.json({ message: 'activity updated' }, { status: 200 });
  } catch (error: any) {
    console.error('Update session activity error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
