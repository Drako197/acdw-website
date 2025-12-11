# Payment Element Flow - Visual Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LANDS ON CHECKOUT PAGE                  │
│  URL: /checkout?product=mini&quantity=1&priceId=xxx&price=99.99│
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKOUT PAGE LOADS                          │
│  • Product details displayed                                    │
│  • Empty address form                                           │
│  • "Calculating shipping..." message                            │
│  • Payment Element: HIDDEN (waiting for address)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              USER STARTS TYPING ADDRESS                          │
│  User types: "123 Main St"                                      │
│  → Address validation (client-side)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│          USER COMPLETES ADDRESS (City, State, ZIP)              │
│  Address: "123 Main St, Boise, ID, 83702"                      │
│  → Triggers shipping calculation                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         STEP 1: CALCULATE SHIPPING (Real-time)                  │
│  Frontend → POST /.netlify/functions/calculate-shipping        │
│  Payload: { address: {...}, products: {...} }                  │
│                                                                  │
│  Backend:                                                       │
│  • Validates address                                            │
│  • Calculates shipping cost ($13.00)                            │
│  • Returns: { cost: 13.00 }                                     │
│                                                                  │
│  Frontend:                                                      │
│  • Updates shipping cost display                                │
│  • Triggers Payment Intent creation                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│      STEP 2: CREATE PAYMENT INTENT (Real-time)                  │
│  Frontend → POST /.netlify/functions/create-payment-intent      │
│  Payload: {                                                     │
│    priceId: "price_xxx",                                        │
│    quantity: 1,                                                 │
│    product: "mini",                                             │
│    shippingAddress: { name, line1, city, state, zip, country } │
│  }                                                              │
│                                                                  │
│  Backend:                                                       │
│  1. Retrieves product price from Stripe                         │
│  2. Calculates product total: $99.99                            │
│  3. Adds shipping: $13.00                                       │
│  4. Creates Payment Intent:                                    │
│     {                                                            │
│       amount: 11299 (cents),                                    │
│       currency: "usd",                                          │
│       shipping: { address: {...} },                             │
│       automatic_tax: { enabled: true }                          │
│     }                                                           │
│  5. Stripe calculates tax: $6.78 (6% Idaho sales tax)          │
│  6. Stripe updates Payment Intent amount: 11977 (cents)        │
│  7. Returns: {                                                  │
│       clientSecret: "pi_xxx_secret_xxx",                        │
│       paymentIntentId: "pi_xxx",                                │
│       taxAmount: 6.78,                                          │
│       shippingCost: 13.00                                       │
│     }                                                           │
│                                                                  │
│  Frontend:                                                      │
│  • Updates tax amount: $6.78                                    │
│  • Updates total: $119.77                                       │
│  • Shows Payment Element (with clientSecret)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              PAYMENT ELEMENT APPEARS                             │
│  • Card number field                                            │
│  • Expiry field                                                  │
│  • CVC field                                                    │
│  • Cardholder name field                                        │
│  • "Pay $119.77" button                                         │
│                                                                  │
│  Order Summary:                                                 │
│  • Product: $99.99                                              │
│  • Shipping: $13.00                                             │
│  • Tax: $6.78                                                   │
│  • Total: $119.77                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         USER CHANGES ADDRESS (Optional)                          │
│  User edits: Changes "Boise, ID" to "Miami, FL"                 │
│  → Triggers shipping recalculation                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│    STEP 3: UPDATE PAYMENT INTENT (Real-time)                    │
│  Frontend → POST /.netlify/functions/update-payment-intent      │
│  Payload: {                                                     │
│    paymentIntentId: "pi_xxx",                                   │
│    shippingAddress: { ...new address... },                      │
│    product: "mini",                                             │
│    quantity: 1,                                                 │
│    priceId: "price_xxx"                                         │
│  }                                                              │
│                                                                  │
│  Backend:                                                       │
│  1. Recalculates shipping: $15.00 (different zone)              │
│  2. Updates Payment Intent:                                     │
│     {                                                            │
│       shipping: { address: {...new address...} },               │
│       amount: 11499 (product + new shipping)                    │
│     }                                                           │
│  3. Stripe recalculates tax: $6.90 (Florida sales tax)          │
│  4. Stripe updates Payment Intent amount: 12189 (cents)        │
│  5. Returns: {                                                  │
│       clientSecret: "pi_xxx_secret_xxx_updated",               │
│       taxAmount: 6.90,                                          │
│       shippingCost: 15.00                                        │
│     }                                                           │
│                                                                  │
│  Frontend:                                                      │
│  • Updates shipping: $15.00                                     │
│  • Updates tax: $6.90                                           │
│  • Updates total: $121.89                                       │
│  • Payment Element updates automatically                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            USER ENTERS PAYMENT DETAILS                           │
│  • Card number: 4242 4242 4242 4242                             │
│  • Expiry: 12/25                                                │
│  • CVC: 123                                                     │
│  • Cardholder: John Doe                                         │
│                                                                  │
│  Payment Element validates in real-time                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              USER CLICKS "PAY $121.89"                          │
│  Frontend calls: stripe.confirmPayment()                        │
│  {                                                              │
│    elements,                                                    │
│    confirmParams: { return_url: "/checkout/success" },         │
│    redirect: "if_required"                                       │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            STRIPE PROCESSES PAYMENT                              │
│  • Validates card                                               │
│  • Charges card                                                 │
│  • Updates Payment Intent status: "succeeded"                   │
│  • Sends webhook: payment_intent.succeeded                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│   FRONTEND SUCCESS        │  │   WEBHOOK PROCESSING       │
│   • Payment succeeded     │  │   • Receives event         │
│   • Navigate to:          │  │   • Extracts shipping     │
│     /checkout/success?    │  │   • Extracts tax           │
│     payment_intent=pi_xxx│  │   • Creates ShipStation    │
│                          │  │     order                  │
│                          │  │   • Sends confirmation    │
└───────────┬──────────────┘  └───────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUCCESS PAGE LOADS                            │
│  Frontend → GET /.netlify/functions/get-payment-intent           │
│  Query: ?payment_intent=pi_xxx                                  │
│                                                                  │
│  Backend:                                                       │
│  • Retrieves Payment Intent from Stripe                         │
│  • Extracts: product, shipping, tax, total, address            │
│  • Returns order details                                        │
│                                                                  │
│  Frontend:                                                      │
│  • Displays order confirmation                                  │
│  • Shows order number                                           │
│  • Shows shipping address                                       │
│  • Shows itemized breakdown                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Key Differences from Current Flow

### Current (Stripe Checkout)
```
Your Page → Stripe Checkout → Success
   ↓            ↓
Address      Address
Shipping     Tax
```

### New (Payment Element)
```
Your Page → Success
   ↓
Address
Shipping (real-time)
Tax (real-time)
Payment (embedded)
```

## Real-Time Updates Flow

```
Address Change
    ↓
┌─────────────────────────────────────┐
│  Debounce (500ms)                  │
│  Prevents too many API calls        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Calculate Shipping                 │
│  POST /calculate-shipping           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Update Payment Intent               │
│  POST /update-payment-intent         │
│  • New shipping address              │
│  • New shipping cost                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Stripe Recalculates Tax             │
│  • Based on new address              │
│  • Updates Payment Intent amount     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend Updates                    │
│  • Shipping cost                     │
│  • Tax amount                        │
│  • Total                             │
│  • Payment Element (auto-updates)    │
└─────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    ↓
┌─────────────────────────────────────┐
│  Identify Error Type                │
│  • Shipping calculation failed      │
│  • Payment Intent creation failed    │
│  • Payment Intent update failed     │
│  • Payment processing failed         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Display User-Friendly Error        │
│  • "Unable to calculate shipping"    │
│  • "Payment failed, please try again"│
│  • "Network error, retrying..."      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Allow User Action                  │
│  • Retry                             │
│  • Edit address                      │
│  • Contact support                   │
└─────────────────────────────────────┘
```

## State Management Flow

```
Component State:
├── shippingAddress (ShippingAddress)
├── shippingCost (number | null)
├── taxAmount (number)
├── clientSecret (string | null)
├── paymentIntentId (string | null)
├── isProcessing (boolean)
└── errors (object)

Effects:
├── Address changes → Calculate shipping
├── Shipping calculated → Create Payment Intent
├── Address changes (with PI) → Update Payment Intent
└── Payment succeeds → Navigate to success
```

