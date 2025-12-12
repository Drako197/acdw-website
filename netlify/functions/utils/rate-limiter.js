const { getStore } = require('@netlify/blobs')

const DEFAULT_RATE_LIMITS = {
    form: { maxRequests: 10, windowMs: 60 * 1000 },
    api: { maxRequests: 30, windowMs: 60 * 1000 },
    strict: { maxRequests: 5, windowMs: 60 * 1000 },
    upload: { maxRequests: 10, windowMs: 60 * 1000 },
}

let rateLimitStore = null

const initStore = () => {
    if (!rateLimitStore) {
        try {
            rateLimitStore = getStore('rate-limits')
        } catch (error) {
            console.warn('Failed to initialize rate limit store:', error.message)
            return null
        }
    }
    return rateLimitStore
}

const getRateLimitKey = (ip, type) => {
    const sanitizedIP = ip.replace(/[^a-zA-Z0-9.:]/g, '_')
    return `${type}:${sanitizedIP}`
}

const checkRateLimit = async (ip, type = 'api') => {
    const config = DEFAULT_RATE_LIMITS[type] || DEFAULT_RATE_LIMITS.api
    const now = Date.now()
    const windowStart = now - config.windowMs
    const store = initStore()

    if (!store) {
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            limit: config.maxRequests,
            resetTime: now + config.windowMs,
            retryAfter: 0,
            persistent: false,
        }
    }

    const key = getRateLimitKey(ip, type)

    try {
        let timestamps = []
        try {
            const stored = await store.get(key, { type: 'json' })
            if (stored && Array.isArray(stored.timestamps)) {
                timestamps = stored.timestamps.filter(ts => ts > windowStart)
            }
        } catch (e) { }

        const count = timestamps.length
        const allowed = count < config.maxRequests

        if (allowed) {
            timestamps.push(now)
            await store.setJSON(key, { timestamps, lastRequest: now, ip }, {
                expirationTtl: Math.ceil(config.windowMs / 1000) + 60,
            })
        }

        const resetTime = timestamps.length > 0
            ? Math.min(...timestamps) + config.windowMs
            : now + config.windowMs

        return {
            allowed,
            remaining: Math.max(0, config.maxRequests - count - (allowed ? 1 : 0)),
            limit: config.maxRequests,
            resetTime,
            retryAfter: allowed ? 0 : Math.ceil((resetTime - now) / 1000),
            persistent: true,
        }
    } catch (error) {
        console.error('Rate limit check error:', error.message)
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            limit: config.maxRequests,
            resetTime: now + config.windowMs,
            retryAfter: 0,
            persistent: false,
        }
    }
}

// Sync fallback for functions that can't use async
const inMemoryStore = new Map()

const checkRateLimitSync = (ip, type = 'api') => {
    const config = DEFAULT_RATE_LIMITS[type] || DEFAULT_RATE_LIMITS.api
    const now = Date.now()
    const windowStart = now - config.windowMs
    const key = `${type}:${ip}`

    let timestamps = inMemoryStore.get(key) || []
    timestamps = timestamps.filter(ts => ts > windowStart)

    const count = timestamps.length
    const allowed = count < config.maxRequests

    if (allowed) {
        timestamps.push(now)
        inMemoryStore.set(key, timestamps)
    }

    if (Math.random() < 0.1) {
        for (const [k, v] of inMemoryStore.entries()) {
            const filtered = v.filter(ts => ts > windowStart)
            if (filtered.length === 0) inMemoryStore.delete(k)
            else inMemoryStore.set(k, filtered)
        }
    }

    const resetTime = timestamps.length > 0
        ? Math.min(...timestamps) + config.windowMs
        : now + config.windowMs

    return {
        allowed,
        remaining: Math.max(0, config.maxRequests - count - (allowed ? 1 : 0)),
        limit: config.maxRequests,
        resetTime,
        retryAfter: allowed ? 0 : Math.ceil((resetTime - now) / 1000),
        persistent: false,
    }
}

const getRateLimitHeaders = (rateLimitResult) => {
    return {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        ...(rateLimitResult.retryAfter > 0 && {
            'Retry-After': rateLimitResult.retryAfter.toString()
        })
    }
}

const getClientIP = (event) => {
    return event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        event.headers['client-ip'] ||
        event.headers['x-nf-client-connection-ip'] ||
        event.headers['x-real-ip'] ||
        'unknown'
}

module.exports = {
    checkRateLimit,
    checkRateLimitSync,
    getRateLimitHeaders,
    getClientIP,
    DEFAULT_RATE_LIMITS,
}