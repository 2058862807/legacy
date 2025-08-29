import { NextResponse } from "next/server"


export async function GET() {
const data = {
userId: "demo",
documents: 12,
complianceScore: 92,
lastScan: new Date().toISOString()
}
return NextResponse.json(data)
}
