import data from "@/data/data.json";
import { NextResponse } from "next/server";
export function GET() {
   return NextResponse.json(data)
}
