import { NextResponse } from 'next/server'

export async function GET() {
    const now = new Date()
    return NextResponse.json({
        timestamp: Math.floor(now.getTime() / 1000),
        datetime: now.toISOString(),
        timezone: 'UTC', // Defaulting to UTC, next.js environment timezone might differ
    })
}
