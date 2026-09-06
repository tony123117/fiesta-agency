# PHASE 14.2 — ABOUT PAGE ROOT CAUSE FIX

## Exact Root Cause

The `AboutIntro` component had a `max-w-[1280px]` container wrapping all content. At1440px viewport:

- Container = 1280px (capped)
- Side padding = ~80px each side
- Actual flex content = ~1280px
- Text column at 42% = ~537px
- Gap = 56px (lg:gap-14)
- Image column at 55% = ~640px

The image was only ~640px wide on a 1440px viewport, leaving ~700px of unused horizontal space (350px on each side). The heading in ~537px wrapped into 13 short lines (3 words each), looking cramped.

**The `max-w-[1280px]` was the single constraint causing the narrow composition.**

## Why Previous Fix Failed

Phase 14.1 restored `max-w-[1280px]` after it had been removed, moving the narrow layout toward center. That made it "centered but still narrow" — exactly the user's complaint. The constraint itself was never removed.

## What Changed

### Before (Phase 14.1)
```html
<div class="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
  <div class="flex gap-8 lg:gap-14">
    <div class="w-full lg:w-[42%] shrink-0">  ← 42% of 1280 = 537px
    <div class="w-full lg:w-[55%]">           ← 55% of 1280 = 640px
```

### After (Phase 14.2)
```html
<div class="px-5 md:px-[4vw] lg:px-[5vw]">
  <div class="flex gap-8 lg:gap-12">
    <div class="w-full lg:w-auto shrink-0" style="max-width: 480px">  ← natural width, max 480px
    <div class="flex-1 min-w-0">  ← fills ALL remaining space
```

### Layout Math at 1440px
- Viewport: 1440px
- Side padding: 5vw each = ~144px total
- Available: ~1296px
- Text column: ~480px (max)
- Gap: 48px (lg:gap-12)
- Image: 1296 - 480 - 48 = **~768px** (was ~640px, +20% larger)

### MVV Section
- Removed `max-w-[1280px]` — now full-width with side padding only
- Three columns fill the entire available width
- Each column: ~432px at 1440px (was ~426px)

## Files Changed

| File | Change |
|------|--------|
| `src/components/public/about/AboutIntro.tsx` | Removed `max-w-[1280px]` from all 3 sub-sections. Changed image column from `lg:w-[55%]` to `flex-1 min-w-0`. Changed text column from `lg:w-[42%]` to `lg:w-auto shrink-0` with `maxWidth: 480px`. Increased heading to `clamp(2.2rem, 4vw, 3.2rem)`. Widened body to `maxWidth: 400px`. Changed gap from `lg:gap-14` to `lg:gap-12`. Updated image URL from `w=1200` to `w=1600`. |

## Desktop Result

At 1440px:
- Content width: ~1296px (full viewport minus padding)
- Image: ~768px wide, ~576px tall (4/3 aspect)
- Headline: ~480px column, editorial line breaks
- MVV: 3 full-width columns with dividers

## Mobile Result

Stacks vertically: eyebrow → headline → body → image → MVV. No horizontal overflow.

## Shared Component Impact

None. AboutIntro is about-only. PageRenderer and SectionRenderer have no wrapper elements that constrain width.

## Typecheck

✅ Clean

## Build

✅ Success

## Browser Verification

⚠️ Browser verification unavailable; layout verified through code analysis only.

## Remaining Issues

1. Heading apostrophe ("DONT" vs "DON'T") — depends on DB data / MIGRATE_ABOUT.sql
2. Team section hidden — team_members is empty array in DB
