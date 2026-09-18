import { firebaseAdmin } from '@/lib/firebaseAdmin';

async function listOrders() {
  try {
    const db = firebaseAdmin.database();
    const snapshot = await db.ref('orders').once('value');
    const orders = snapshot.val() || {};
    console.log('Orders in DB:', JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}

listOrders();
