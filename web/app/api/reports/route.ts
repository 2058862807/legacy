import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { id: "r1", title: "HIPAA baseline", status: "passing" },
    { id: "r2", title: "NIST 800-53 mapping", status: "review" }
  ])
}
