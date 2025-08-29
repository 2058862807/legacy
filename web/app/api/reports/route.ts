import { NextResponse } from "next/server"


export async function GET() {
// Mock data so the page builds without your backend
return NextResponse.json([
{ id: "rpt-001", title: "HIPAA baseline", status: "passing" },
{ id: "rpt-002", title: "NIST 800-53 map", status: "review" }
])
}
