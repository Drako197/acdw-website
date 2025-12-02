# Signup Form - Account Type Selection UX Options

## Current Problem

The account type selection is currently:
- A dropdown field
- Positioned 3 fields down (after Name, Email, Password)
- Easy to miss or overlook
- Not visually prominent

**Impact:** Users might not realize they need to select an account type, or might miss it entirely.

---

## Option 1: Card-Based Selection at Top (Recommended) ⭐

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Create Your Account                                │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ 🏠 Homeowner │  │ 🔧 HVAC Pro  │  │ 🏢 Prop   │ │
│  │              │  │              │  │ Manager   │ │
│  │ [Selected]   │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                     │
│  [Form fields below based on selection]            │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Very prominent and obvious
- Visual cards are easy to understand
- Can show benefits/features on hover or selection
- Similar to CustomerTypeSelector (familiar pattern)
- Mobile-friendly (stacks vertically)

**Cons:**
- Takes more vertical space
- Might feel like extra step for simple signups

**Best for:** Making account type the primary decision point

---

## Option 2: Step-Based Wizard (Select Type First)

**Layout:**
```
Step 1: Choose Account Type
┌─────────────────────────────────────────────────────┐
│  What type of account are you creating?            │
│                                                     │
│  [ ] Homeowner                                      │
│  [ ] HVAC Professional                             │
│  [ ] Property Manager                               │
│                                                     │
│  [Continue →]                                       │
└─────────────────────────────────────────────────────┘

Step 2: Account Details (shown after type selection)
```

**Pros:**
- Forces account type selection first
- Clear progression
- Can show different fields based on type
- Reduces form complexity

**Cons:**
- Extra step/click
- Might feel slower for simple signups
- More complex state management

**Best for:** When account type significantly changes the form

---

## Option 3: Prominent Radio Buttons at Top

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Create Your Account                                │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Account Type *                                     │
│                                                     │
│  ( ) Homeowner                                      │
│  (•) HVAC Professional  ← Selected                  │
│  ( ) Property Manager                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  Name *                                             │
│  [________________]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Simple and clear
- Doesn't take much space
- Standard form pattern
- Easy to scan

**Cons:**
- Less visually engaging
- Still might be missed if not prominent enough
- No visual differentiation

**Best for:** Quick, simple improvement

---

## Option 4: Visual Tabs at Top

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Create Your Account                                │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Homeowner│  │ HVAC Pro │  │Prop Mgr  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│     [Active]                                       │
│                                                     │
│  [Form fields below]                               │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Clean, modern look
- Easy to switch between types
- Compact
- Familiar pattern (like browser tabs)

**Cons:**
- Might not be obvious it's required
- Less space for descriptions

**Best for:** When users might want to compare types

---

## Option 5: Hero Section with Type Selection

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Create Your Account                                │
│                                                     │
│  Who are you?                                       │
│  Select the account type that best fits you:       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🏠 Homeowner                                 │   │
│  │ Perfect for protecting your home             │   │
│  │ [Select]                                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔧 HVAC Professional                         │   │
│  │ Contractor pricing and bulk ordering         │   │
│  │ [Select]                                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Form appears below after selection]              │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Very clear and prominent
- Can show benefits before selection
- Guides user decision
- Professional appearance

**Cons:**
- Takes significant space
- Form appears conditionally (might feel like wizard)

**Best for:** When account type is critical decision

---

## Option 6: Inline Card Selection (Compact)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Create Your Account                                │
│                                                     │
│  Account Type *                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐                     │
│  │ 🏠   │  │ 🔧   │  │ 🏢   │                     │
│  │Home  │  │HVAC  │  │Prop  │                     │
│  │owner │  │Pro   │  │Mgr   │                     │
│  └──────┘  └──────┘  └──────┘                     │
│                                                     │
│  Name *                                             │
│  [________________]                                 │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Compact but visual
- Icons make it clear
- Doesn't take much space
- Still prominent

**Cons:**
- Less space for descriptions
- Might need tooltips for clarity

**Best for:** Balance between prominence and space

---

## My Recommendation: **Option 1 (Card-Based Selection)**

**Why:**
1. **Most Prominent:** Impossible to miss
2. **Visual Clarity:** Cards are intuitive
3. **Familiar Pattern:** Similar to CustomerTypeSelector on homepage
4. **Mobile-Friendly:** Stacks nicely on small screens
5. **Can Show Benefits:** Hover or selection can reveal benefits
6. **Professional:** Looks modern and polished

**Implementation:**
- Place at the very top of the form
- Large, clickable cards with icons
- Show selected state clearly
- Display benefits/features when selected
- Smooth transition to form fields below

---

## Quick Win Alternative: **Option 3 (Prominent Radio Buttons)**

If you want a faster implementation:
- Move account type to the top
- Use large, prominent radio buttons
- Add visual separator (horizontal rule)
- Keep it simple but make it first

---

## Visual Comparison

### Current (Dropdown, 3rd field):
```
Name *
Email *
Password *
Account Type [Dropdown ▼]  ← Easy to miss
```

### Option 1 (Cards at top):
```
[Large Visual Cards - 3 across]
Account Type is OBVIOUS

Name *
Email *
Password *
```

### Option 3 (Radio at top):
```
Account Type *  ← First thing they see
( ) Homeowner
(•) HVAC Pro
( ) Property Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name *
Email *
Password *
```

---

## Which option would you like me to implement?

I recommend **Option 1** for maximum prominence, but **Option 3** is a quick win if you want something faster.

