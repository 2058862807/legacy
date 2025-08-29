import { NextResponse } from "next/server"


export async function GET(req: Request) {
const { searchParams } = new URL(req.url)
const sessionId = searchParams.get("session_id") || "unknown"
const status = sessionId === "unknown" ? "not_found" : "paid"
return NextResponse.json({ session_id: sessionId, status })
}
