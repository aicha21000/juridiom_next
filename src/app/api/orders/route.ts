import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * API endpoint that returns all orders stored in the Realtime Database.
 *
 * For now we expose the full list – the client‑side page will filter the
 * orders belonging to the signed‑in user. In a production setting you would
 * verify the Firebase ID token (available in the `Authorization` header) and
 * return only the orders that match the user’s UID or email.
 */
export async function GET(request: NextRequest) {
  try {
    const db = firebaseAdmin.database();
    const snapshot = await db.ref("orders").once("value");
    const raw = snapshot.val() || {};
    const orders = Object.entries(raw).map(([id, data]) => ({
      id,
      ...(data as Record<string, any>),
    }));
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
