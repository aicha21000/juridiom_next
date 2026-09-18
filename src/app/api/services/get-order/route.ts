// src/app/api/services/get-order/route.ts
import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'orderId query parameter required' }, { status: 400 });
  }

  try {
    const db = firebaseAdmin.database();
    const snapshot = await db.ref(`orders/${orderId}`).get();
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const order = snapshot.val();
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
