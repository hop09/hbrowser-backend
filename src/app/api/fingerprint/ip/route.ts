import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    let ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1'

    if (ip === '127.0.0.1' || ip === '::1') {
        try {
            const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) })
            if (res.ok) {
                const data = await res.json()
                ip = data.ip
            }
        } catch (e) {
            // Ignore
        }
    }

    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, {
            signal: AbortSignal.timeout(5000)
        })

        if (geoRes.ok) {
            const data = await geoRes.json()
            if (data.status === 'success') {
                return NextResponse.json({
                    success: true,
                    ip: data.query || ip,
                    country: data.country || 'Unknown',
                    countryCode: data.countryCode || 'XX',
                    region: data.regionName || 'Unknown',
                    city: data.city || 'Unknown',
                    timezone: data.timezone || 'Unknown',
                    isp: data.isp || 'Unknown',
                    org: data.org || 'Unknown',
                    lat: data.lat || 0,
                    lon: data.lon || 0,
                })
            }
        }
    } catch (e) {
        // Ignore
    }

    return NextResponse.json({
        success: false,
        ip: ip,
        country: 'Unknown',
        countryCode: 'XX',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'Unknown',
        isp: 'Unknown',
        org: 'Unknown',
        lat: 0,
        lon: 0,
    })
}
