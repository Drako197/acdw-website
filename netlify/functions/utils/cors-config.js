const ALLOWED_ORIGINS = [
    'https://www.acdrainwiz.com',
    'https://acdrainwiz.com',
    'http://localhost:5173',
    'http://localhost:3000',
]

const ALLOWED_PATTERNS = [
    /^https:\/\/[a-z0-9]+--lucky-frangollo-bf579b\.netlify\.app$/,
]

const isOriginAllowed = (event) => {
    const origin = event.headers.origin || event.headers.Origin || ''
    if (ALLOWED_ORIGINS.includes(origin)) return true
    return ALLOWED_PATTERNS.some(pattern => pattern.test(origin))
}

const getCORSOrigin = (event) => {
    const origin = event.headers.origin || event.headers.Origin || ''
    return isOriginAllowed(event) ? origin : ALLOWED_ORIGINS[0]
}

const getCORSHeaders = (event) => {
    return {
        'Access-Control-Allow-Origin': getCORSOrigin(event),
        'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
    }
}

const getSecurityHeaders = (event) => {
    return {
        'Content-Type': 'application/json',
        ...getCORSHeaders(event),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    }
}

module.exports = {
    ALLOWED_ORIGINS,
    ALLOWED_PATTERNS,
    getCORSOrigin,
    getCORSHeaders,
    getSecurityHeaders,
    isOriginAllowed,
}