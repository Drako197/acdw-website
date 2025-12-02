# Mini Product Hero Layout Options

**Goal:** Full-width background image hero with integrated purchase card

---

## Option 1: Split Layout (Text Left, Purchase Card Right)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│  ┌──────────────┐        ┌──────────────┐         │
│  │ Product Info │        │ Purchase     │         │
│  │ - Title      │        │ Card         │         │
│  │ - Subtitle   │        │ - Quantity   │         │
│  │ - Price      │        │ - Total      │         │
│  │ - Features   │        │ - Buy Now   │         │
│  └──────────────┘        └──────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Clear separation of info and purchase
- Purchase card always visible
- Good for desktop (side-by-side)
- Professional, balanced look

**Cons:**
- Purchase card might be below fold on mobile
- Less space for product imagery

**Best for:** Desktop-first experience, clear CTA visibility

---

## Option 2: Centered Text with Floating Purchase Card

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│           ┌──────────────────────┐                 │
│           │   Product Title       │                 │
│           │   Subtitle            │                 │
│           │   Price               │                 │
│           └──────────────────────┘                 │
│                                                     │
│  ┌──────────────┐                                  │
│  │ Purchase     │  (Floating right, slightly      │
│  │ Card         │   below center)                  │
│  └──────────────┘                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Centered, focused design
- Purchase card doesn't compete with main content
- More space for background image
- Apple-like aesthetic

**Cons:**
- Purchase card might be less prominent
- Could feel unbalanced on some screens

**Best for:** Premium, minimalist aesthetic, image-focused

---

## Option 3: Text Left, Purchase Card Overlay Right

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│  ┌──────────────┐                                  │
│  │ Product Info │        ┌──────────────┐          │
│  │ - Title      │        │ Purchase    │          │
│  │ - Subtitle   │        │ Card        │          │
│  │ - Price      │        │ (Overlay)   │          │
│  │              │        │             │          │
│  │              │        └──────────────┘          │
│  └──────────────┘                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Purchase card feels integrated
- Good use of space
- Modern, layered design
- Purchase card has visual prominence

**Cons:**
- Might overlap background image details
- Need careful positioning

**Best for:** Modern, layered design, prominent CTA

---

## Option 4: Stacked with Purchase Card Below (Mobile-First)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│           ┌──────────────────────┐                 │
│           │   Product Title       │                 │
│           │   Subtitle            │                 │
│           │   Price               │                 │
│           └──────────────────────┘                 │
│                                                     │
│           ┌──────────────────────┐                 │
│           │   Purchase Card      │                 │
│           │   (Centered)         │                 │
│           └──────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Works great on mobile
- Clear visual hierarchy
- All content visible at once
- Simple, clean layout

**Cons:**
- Purchase card below fold on desktop
- Less efficient use of horizontal space

**Best for:** Mobile-first approach, simplicity

---

## Option 5: Asymmetric Split (Text Left 60%, Purchase Right 40%)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────┐       │
│  │ Product Info (60%)    │  │ Purchase     │       │
│  │ - Large Title         │  │ Card (40%)   │       │
│  │ - Subtitle            │  │              │       │
│  │ - Price               │  │              │       │
│  │ - Key Features        │  │              │       │
│  └──────────────────────┘  └──────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- More space for product information
- Purchase card still prominent
- Balanced but not equal split
- Good for detailed product info

**Cons:**
- Might feel unbalanced
- Purchase card smaller

**Best for:** Information-rich product pages

---

## Option 6: Hero with Sticky Purchase Card (Recommended)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Background Image - Full Width]                   │
│                                                     │
│  ┌──────────────┐                                  │
│  │ Product Info │                                  │
│  │ - Title      │                                  │
│  │ - Subtitle   │                                  │
│  │ - Price      │                                  │
│  └──────────────┘                                  │
│                                                     │
│  [Purchase Card - Sticky on scroll, positioned     │
│   right side on desktop, bottom on mobile]         │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Purchase card always accessible
- Doesn't compete with hero content
- Best of both worlds
- Modern UX pattern

**Cons:**
- More complex implementation
- Requires scroll behavior

**Best for:** Long-form product pages, conversion optimization

---

## My Recommendation

**Option 1 (Split Layout)** or **Option 3 (Overlay Right)** for immediate visibility and a clean, professional look.

Which option do you prefer? I can implement any of these or combine elements from multiple options.

