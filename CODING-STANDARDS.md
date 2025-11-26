# Coding Standards & Best Practices

## Class Naming Convention

### ✅ DO: Use Human-Friendly Class Names

All new pages and components should use descriptive, human-readable class names that clearly indicate their purpose.

**Examples:**
- ✅ `hvac-pro-catalog-container` (clear, descriptive)
- ✅ `signup-form-label-icon` (indicates location and purpose)
- ✅ `property-manager-pricing-section` (specific and meaningful)
- ✅ `checkout-success-message` (describes what it is)

### ❌ DON'T: Use Generic or Abbreviated Names

- ❌ `container` (too generic)
- ❌ `div1`, `div2` (meaningless)
- ❌ `btn-primary` (could be anywhere)
- ❌ `section-1` (not descriptive)

### Pattern to Follow

Use a **component/page prefix** followed by a **descriptive name**:

```
{page-or-component-name}-{element-type}-{purpose}
```

**Examples:**
- `hvac-pro-catalog-container`
- `signup-form-email-field`
- `property-manager-pricing-table`
- `checkout-button-primary`

---

## Content Guidelines

### Discount/Pricing Mentions

**❌ DON'T:** Mention specific discount percentages or amounts on pre-login pages
- ❌ "42% off MSRP"
- ❌ "10% lower than contractors"
- ❌ "$50 off"

**✅ DO:** Use general, benefit-focused language
- ✅ "Tiered pricing with volume discounts"
- ✅ "Best-in-class pricing for property managers"
- ✅ "Exclusive contractor pricing"
- ✅ "Bulk ordering savings"

**Rationale:** Specific pricing should only be visible after login when users can see their actual pricing tiers.

---

## Implementation Checklist

When creating new pages/components:

- [ ] All class names are human-friendly and descriptive
- [ ] Class names follow the `{page}-{element}-{purpose}` pattern
- [ ] No specific discount percentages on pre-login pages
- [ ] Pricing mentions are general and benefit-focused
- [ ] CSS classes are organized and documented

---

## Examples from Existing Code

### Good Examples:
```tsx
<div className="hvac-pro-catalog-container">
  <div className="hvac-pro-catalog-wrapper">
    <div className="hvac-pro-catalog-header">
      <h1 className="hvac-pro-catalog-title">HVAC Pro Catalog</h1>
    </div>
  </div>
</div>
```

### Bad Examples:
```tsx
<div className="container">
  <div className="wrapper">
    <div className="header">
      <h1 className="title">Catalog</h1>
    </div>
  </div>
</div>
```

---

**Remember:** Class names should be self-documenting. Anyone reading the code should understand what each element is and where it belongs.

