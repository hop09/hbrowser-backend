import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me-in-production'
const key = new TextEncoder().encode(secretKey)

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Laravel default typically 60m to 24h
        .sign(key)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export function extractTokenFromHeader(authHeader: string | null) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.split(' ')[1]
}
