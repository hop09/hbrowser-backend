import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        version: process.env.CLIENT_VERSION || '1.0.0',
        min_version: process.env.MIN_CLIENT_VERSION || '1.0.0',
        download_url: process.env.DOWNLOAD_URL || 'https://example.com/download',
        message: 'A new version is available. Please update to continue.'
    })
}
