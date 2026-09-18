import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }
    const db = firebaseAdmin.database();
    // Update a `lastActivity` timestamp for the session/order
    await db.ref(`orders/${sessionId}/lastActivity`).set(new Date().toISOString());
    return NextResponse.json({ message: 'activity updated' }, { status: 200 });
  } catch (error: any) {
    console.error('Update session activity error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
