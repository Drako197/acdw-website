# 🗄️ Netlify Blobs & KV: Deep Dive Explanation

**Date:** December 8, 2025  
**Purpose:** Complete technical explanation of how Netlify Blobs/KV works

---

## 🎯 The Relationship: Blobs = KV Storage

**Key Insight:** Netlify Blobs IS the key-value storage system. "KV" (Key-Value) is just how you use it.

- **Netlify Blobs** = The storage service/platform
- **KV Store** = A namespace/container within Blobs
- **Key-Value pairs** = How data is stored (like a JavaScript Map or Object)

Think of it like:
- **Blobs** = The entire database
- **KV Store** = A table/collection
- **Key-Value pairs** = Individual rows/records

---

## 🏗️ Architecture Overview

### How It Works Under the Hood

```
┌─────────────────────────────────────────┐
│         Netlify Blobs Platform          │
│  (Managed by Netlify, no setup needed)  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼────┐            ┌────▼────┐
   │ Store 1 │            │ Store 2 │
   │ (KV)    │            │ (KV)    │
   └────┬────┘            └────┬────┘
        │                       │
   ┌────▼────┐            ┌────▼────┐
   │ Key:    │            │ Key:    │
   │ Value:  │            │ Value:  │
   └─────────┘            └─────────┘
```

### What Gets Stored

**Blobs can store:**
- ✅ JSON objects (our use case)
- ✅ Strings
- ✅ Binary data (images, files)
- ✅ Any unstructured data

**For our bot defense:**
- CSRF tokens: `{ token: "abc123", expires: 1234567890 }`
- IP blacklist: `{ ip: "1.2.3.4", blockedAt: 1234567890, reason: "bot" }`
- Behavioral patterns: `{ count: 5, timestamps: [...] }`

---

## 📦 Package: `@netlify/blobs` (Not `@netlify/kv`)

**Important:** The correct package is `@netlify/blobs`, not `@netlify/kv`.

### Installation

```bash
npm install @netlify/blobs
```

### Usage in Netlify Functions

```javascript
import { getStore } from '@netlify/blobs'

// Get a store (creates if doesn't exist)
const store = getStore('my-store-name')

// Set a value (with optional expiration)
await store.set('my-key', 'my-value', {
  expirationTtl: 3600 // 1 hour in seconds
})

// Get a value
const value = await store.get('my-key')

// Delete a value
await store.delete('my-key')

// List all keys
const keys = await store.list()
```

---

## 🔧 How We're Using It

### For CSRF Tokens

**Store Name:** `csrf-tokens`  
**Key Format:** `csrf:{token}`  
**Value Format:** `{ createdAt, expires, ip, used }`

```javascript
// Store token
await store.set(`csrf:${token}`, {
  createdAt: Date.now(),
  expires: Date.now() + 15 * 60 * 1000,
  ip: '1.2.3.4',
  used: false
}, { expirationTtl: 900 }) // 15 minutes

// Retrieve token
const tokenData = await store.get(`csrf:${token}`)

// Mark as used
tokenData.used = true
await store.set(`csrf:${token}`, tokenData)
```

### For IP Blacklist

**Store Name:** `bot-blacklist`  
**Key Format:** `bot-blacklist:{ip}`  
**Value Format:** `{ blockedAt, reason, attempts, ip, userAgent }`

```javascript
// Add to blacklist
await store.set(`bot-blacklist:${ip}`, {
  blockedAt: Date.now(),
  reason: 'Bot detected',
  attempts: 1,
  ip: '1.2.3.4',
  userAgent: 'curl/7.68.0'
}, { expirationTtl: 86400 }) // 24 hours

// Check blacklist
const entry = await store.get(`bot-blacklist:${ip}`)
if (entry && Date.now() - entry.blockedAt < 24 * 60 * 60 * 1000) {
  // Still blocked
}
```

---

## 🎛️ Creating Stores in Netlify Dashboard

### Step-by-Step

1. **Go to Netlify Dashboard**
   - Navigate to your site
   - Click "Functions" in left sidebar
   - Click "KV" or "Blobs" tab

2. **Create Store**
   - Click "Create KV store" or "Add store"
   - Enter store name (e.g., `csrf-tokens`)
   - Click "Create"

3. **Link to Site**
   - In store settings, click "Link to site"
   - Select your site
   - Store is now available to all functions

### What Happens Behind the Scenes

When you create a store:
- ✅ Netlify creates a namespace in their blob storage
- ✅ Store is automatically linked to your site
- ✅ Functions can access it via `getStore('store-name')`
- ✅ No database setup, no configuration files needed

---

## 🔐 Security & Access

### How Access Works

1. **Automatic Authentication:**
   - Functions run in Netlify's environment
   - Automatically authenticated to access your site's stores
   - No API keys needed in code

2. **Store Isolation:**
   - Each store is isolated to your site
   - Other sites cannot access your stores
   - Keys are namespaced per store

3. **Environment Variables:**
   - Not needed for basic access
   - Store names are hardcoded in functions
   - Access is automatic based on site context

---

## 💾 Data Persistence

### What Persists

- ✅ **Data survives deployments** (unlike in-memory)
- ✅ **Data survives cold starts** (unlike function memory)
- ✅ **Data survives function updates**
- ✅ **Automatic expiration** (TTL support)

### What Doesn't Persist

- ❌ Data is lost if you delete the store
- ❌ Data is lost if you delete the site
- ❌ No automatic backups (you'd need to export manually)

---

## ⚡ Performance Characteristics

### Read Performance
- **Fast:** < 10ms for simple reads
- **Cached:** Frequently accessed data is cached
- **Optimized for reads:** Blobs are optimized for frequent reads

### Write Performance
- **Fast:** < 50ms for writes
- **Optimized for infrequent writes:** Best for occasional updates
- **Not for high-frequency writes:** Not designed for rapid-fire writes

### Our Use Cases

| Use Case | Read Frequency | Write Frequency | Good Fit? |
|----------|---------------|-----------------|-----------|
| CSRF Tokens | High (every form submit) | Medium (token generation) | ✅ Yes |
| IP Blacklist | High (every request) | Low (only when blocking) | ✅ Yes |
| Behavioral Patterns | Medium (pattern analysis) | Low (only on submission) | ✅ Yes |

---

## 📊 Storage Limits

### Free Tier
- **Storage:** 1 GB total
- **Operations:** Unlimited (within reason)
- **Stores:** Unlimited

### Our Estimated Usage

| Store | Estimated Size | Keys | TTL |
|-------|---------------|------|-----|
| `csrf-tokens` | ~1 KB per token | ~100 active | 15 min |
| `bot-blacklist` | ~500 bytes per IP | ~1000 IPs | 24 hours |
| **Total** | **~500 KB** | **~1100 keys** | **Well under 1 GB** |

**Verdict:** We're well within free tier limits! 🎉

---

## 🔄 How Our Code Works

### Current Implementation (Needs Update)

Our code currently uses `@netlify/kv` (which may not exist or be outdated):

```javascript
// ❌ Current (may not work)
const { getStore } = require('@netlify/kv')
const store = getStore()
```

### Correct Implementation

Should use `@netlify/blobs`:

```javascript
// ✅ Correct
const { getStore } = require('@netlify/blobs')
const store = getStore('csrf-tokens') // Store name required
```

### Fallback Strategy

Our code has a smart fallback:

```javascript
try {
  const { getStore } = require('@netlify/blobs')
  const store = getStore('csrf-tokens')
  // Use store
} catch (error) {
  // Fallback to in-memory Map
  // Works but not persistent
}
```

This means:
- ✅ If Blobs is available → Use persistent storage
- ✅ If Blobs is not available → Use in-memory (works but not persistent)
- ✅ No breaking changes if Blobs isn't configured

---

## 🆚 Blobs vs Other Storage Options

### Blobs vs Database (PostgreSQL, MySQL)

| Feature | Blobs | Database |
|---------|-------|----------|
| Setup | Zero config | Requires setup |
| Queries | Key-value only | SQL queries |
| Relationships | None | Foreign keys |
| Best for | Simple key-value | Complex data |
| Cost | Free tier | Paid |

**For our use case:** Blobs is perfect (simple key-value, no relationships)

### Blobs vs Redis

| Feature | Blobs | Redis |
|---------|-------|-------|
| Setup | Zero config | Requires server |
| Persistence | Automatic | Configurable |
| Speed | Fast | Very fast |
| Cost | Free tier | Paid hosting |

**For our use case:** Blobs is better (no setup, free, fast enough)

### Blobs vs LocalStorage (Browser)

| Feature | Blobs | LocalStorage |
|---------|-------|-------------|
| Location | Server (Netlify) | Client (Browser) |
| Persistence | Across devices | Per device |
| Security | Server-side | Client-side |
| Access | Functions only | JavaScript only |

**For our use case:** Blobs is required (server-side, secure)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Store not found"

**Problem:** `getStore('my-store')` returns undefined

**Solutions:**
1. Verify store exists in Netlify Dashboard
2. Verify store is linked to your site
3. Check store name spelling (case-sensitive)

### Issue 2: "Package not found"

**Problem:** `Cannot find module '@netlify/blobs'`

**Solutions:**
1. Install package: `npm install @netlify/blobs`
2. Add to `package.json` dependencies
3. Redeploy to Netlify

### Issue 3: "Data not persisting"

**Problem:** Data lost after deployment

**Solutions:**
1. Verify store is created (not just in-memory fallback)
2. Check TTL isn't too short
3. Verify store is linked to site

---

## 📝 Best Practices

### 1. Store Naming

✅ **Good:**
- `csrf-tokens`
- `bot-blacklist`
- `user-sessions`

❌ **Bad:**
- `store1` (not descriptive)
- `tokens` (too generic)
- `my-store` (not specific)

### 2. Key Naming

✅ **Good:**
- `csrf:${token}` (namespaced)
- `bot-blacklist:${ip}` (descriptive)
- `user:${userId}` (clear purpose)

❌ **Bad:**
- `token` (collision risk)
- `123` (not descriptive)
- `data` (too generic)

### 3. TTL (Time To Live)

✅ **Good:**
- CSRF tokens: 15 minutes (900 seconds)
- Blacklist: 24 hours (86400 seconds)
- Cache: 1 hour (3600 seconds)

❌ **Bad:**
- No TTL for temporary data (memory leak)
- Too long TTL for sensitive data (security risk)
- Too short TTL for permanent data (unnecessary)

---

## 🎓 Summary

**Netlify Blobs:**
- ✅ Is the underlying storage system
- ✅ Provides key-value storage
- ✅ Zero configuration needed
- ✅ Free tier: 1 GB storage
- ✅ Optimized for reads
- ✅ Automatic expiration (TTL)

**KV Stores:**
- ✅ Are namespaces within Blobs
- ✅ Organize data by purpose
- ✅ Created in Netlify Dashboard
- ✅ Linked to your site
- ✅ Accessible from all functions

**Our Implementation:**
- ✅ Uses `@netlify/blobs` package
- ✅ Has in-memory fallback
- ✅ Works even if Blobs not configured
- ✅ Needs store creation in dashboard

---

**Next Steps:**
1. Install `@netlify/blobs` package
2. Update code to use correct package
3. Create stores in Netlify Dashboard
4. Test persistence

