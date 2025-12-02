# Stripe → ShipStation Integration Proposal

## Overview
Automatically send order information from Stripe to ShipStation when a payment is successfully completed, enabling automated fulfillment.

## Architecture

```
Stripe Payment Success
    ↓
Stripe Webhook (checkout.session.completed)
    ↓
Netlify Function: stripe-webhook.js
    ↓
Netlify Function: create-shipstation-order.js
    ↓
ShipStation API (Create Order)
    ↓
Order appears in ShipStation for fulfillment
```

## What We'll Do

### 1. **Update Stripe Webhook Handler**
- When `checkout.session.completed` event is received
- Extract order details (customer, shipping address, line items)
- Call new ShipStation function to create order

### 2. **Create ShipStation Integration Function**
- New file: `netlify/functions/create-shipstation-order.js`
- Maps Stripe order data to ShipStation order format
- Handles authentication with ShipStation API
- Creates order in ShipStation
- Handles errors and retries

### 3. **Data Mapping**

**From Stripe:**
- Customer name, email, phone
- Shipping address (street, city, state, zip, country)
- Line items (product name, quantity, SKU)
- Order total, subtotal, shipping, tax
- Order ID (Stripe session ID)

**To ShipStation:**
- Order number (Stripe session ID)
- Customer information
- Shipping address
- Order items (product, quantity, SKU)
- Order date
- Order status

### 4. **Product SKU Mapping**
- Need to map Stripe Price IDs to ShipStation SKUs
- Example: `price_1SZ...` → `ACDW-MINI-001`
- Store mapping in environment variables or config file

## Implementation Details

### Step 1: ShipStation API Setup

**What we need from you:**
1. **ShipStation API Key** (from ShipStation Settings → API Settings)
2. **ShipStation API Secret** (from ShipStation Settings → API Settings)
3. **ShipStation Store ID** (if you have multiple stores)
4. **Product SKU Mapping** (Stripe Price ID → ShipStation SKU)

**ShipStation API Endpoint:**
- `POST https://ssapi.shipstation.com/orders/createorder`
- Uses Basic Authentication (API Key + Secret)

### Step 2: Create ShipStation Function

**File:** `netlify/functions/create-shipstation-order.js`

**Functionality:**
- Receives Stripe order data
- Maps to ShipStation format
- Authenticates with ShipStation API
- Creates order
- Returns success/error

**Error Handling:**
- Retry logic for transient failures
- Logging for debugging
- Fallback if ShipStation is down (queue for retry)

### Step 3: Update Stripe Webhook

**File:** `netlify/functions/stripe-webhook.js`

**Changes:**
- When `checkout.session.completed` is received
- Fetch full order details from Stripe
- Call `create-shipstation-order` function
- Log results

### Step 4: Environment Variables

**Add to Netlify:**
- `SHIPSTATION_API_KEY` - Your ShipStation API key
- `SHIPSTATION_API_SECRET` - Your ShipStation API secret
- `SHIPSTATION_STORE_ID` - (Optional) Store ID if multiple stores

**Product SKU Mapping:**
- Option A: Environment variables (one per product)
- Option B: Config file in function
- Option C: Database lookup (if you have one)

**Recommended:** Config file for easier management

## Data Flow Example

### Stripe Webhook Event:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "customer_email": "customer@example.com",
      "shipping_details": {
        "name": "John Doe",
        "address": {
          "line1": "123 Main St",
          "city": "Miami",
          "state": "FL",
          "postal_code": "33101",
          "country": "US"
        }
      },
      "line_items": [...]
    }
  }
}
```

### ShipStation Order Format:
```json
{
  "orderNumber": "cs_test_...",
  "orderDate": "2024-01-15T10:30:00Z",
  "orderStatus": "awaiting_shipment",
  "customerUsername": "customer@example.com",
  "customerEmail": "customer@example.com",
  "billTo": {
    "name": "John Doe",
    "street1": "123 Main St",
    "city": "Miami",
    "state": "FL",
    "postalCode": "33101",
    "country": "US"
  },
  "shipTo": {
    "name": "John Doe",
    "street1": "123 Main St",
    "city": "Miami",
    "state": "FL",
    "postalCode": "33101",
    "country": "US"
  },
  "items": [
    {
      "sku": "ACDW-MINI-001",
      "name": "AC Drain Wiz Mini",
      "quantity": 2,
      "unitPrice": 99.99
    }
  ]
}
```

## Features

### ✅ **Automatic Order Creation**
- Orders appear in ShipStation immediately after payment
- No manual data entry required

### ✅ **Error Handling**
- Retry logic for failed API calls
- Logging for debugging
- Graceful degradation if ShipStation is down

### ✅ **Data Validation**
- Validates required fields before sending
- Handles missing data gracefully

### ✅ **Logging & Monitoring**
- Log all ShipStation API calls
- Track success/failure rates
- Alert on repeated failures

## What We Need From You

### 1. **ShipStation Credentials**
- [ ] API Key
- [ ] API Secret
- [ ] Store ID (if applicable)

### 2. **Product SKU Mapping**
For each product, we need:
- Stripe Price ID → ShipStation SKU

**Example:**
```
Mini (Homeowner): price_1SZ... → ACDW-MINI-001
Mini (Pro Tier 1): price_1SZ... → ACDW-MINI-PRO-T1
Sensor (Pro Tier 1): price_1SZ... → ACDW-SENSOR-PRO-T1
Bundle (Pro Tier 1): price_1SZ... → ACDW-BUNDLE-PRO-T1
```

### 3. **Shipping Configuration**
- [ ] Default shipping method/carrier preference
- [ ] Package dimensions/weight (if needed)
- [ ] Any special shipping instructions

### 4. **Testing**
- [ ] Test order in ShipStation (we'll create a test order)
- [ ] Verify order appears correctly
- [ ] Confirm fulfillment workflow

## Implementation Steps

1. **Create ShipStation function** (`create-shipstation-order.js`)
2. **Update Stripe webhook** to call ShipStation function
3. **Add environment variables** to Netlify
4. **Create SKU mapping** configuration
5. **Test with test order**
6. **Deploy to production**
7. **Monitor and verify** orders are creating correctly

## Error Scenarios & Handling

### Scenario 1: ShipStation API Down
- **Action:** Log error, queue for retry
- **Fallback:** Store order data, retry later

### Scenario 2: Invalid Shipping Address
- **Action:** Log error, notify admin
- **Fallback:** Create order with billing address

### Scenario 3: Missing Product SKU
- **Action:** Use product name as fallback
- **Log:** Warning for manual review

### Scenario 4: API Authentication Failure
- **Action:** Alert admin immediately
- **Fallback:** Stop processing until fixed

## Testing Plan

1. **Test with Stripe test mode:**
   - Create test payment
   - Verify webhook fires
   - Check ShipStation for order

2. **Test error handling:**
   - Invalid API credentials
   - Missing shipping address
   - Invalid product SKU

3. **Test production:**
   - Real payment
   - Verify order in ShipStation
   - Confirm fulfillment can proceed

## Security Considerations

- ✅ API credentials stored in environment variables (secure)
- ✅ ShipStation API uses HTTPS
- ✅ Webhook signature verification (already implemented)
- ✅ No sensitive data in logs

## Timeline Estimate

- **Development:** 2-3 hours
- **Testing:** 1-2 hours
- **Deployment:** 30 minutes
- **Total:** ~4-6 hours

## Questions for You

1. **Do you have ShipStation API credentials ready?**
2. **What are your product SKUs in ShipStation?** (or do we need to create them?)
3. **Any special shipping requirements?** (carrier preferences, packaging, etc.)
4. **Do you want email notifications** when orders are created in ShipStation?
5. **Any custom fields** you need in ShipStation orders?

## Next Steps

Once you approve:
1. I'll create the ShipStation integration function
2. Update the Stripe webhook handler
3. Set up the SKU mapping configuration
4. You provide API credentials
5. We test together
6. Deploy to production

---

**Does this approach work for you?** Let me know if you'd like any changes or have questions!

