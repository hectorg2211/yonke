import { NextResponse } from "next/server";
import { getShopifyConnectionStatus } from "@/lib/shopify/status";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const status = await getShopifyConnectionStatus();
  return NextResponse.json(status);
}
