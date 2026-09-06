# PHASE 14.1 — ABOUT PAGE VISUAL COMPOSITION FIX

## Root Cause

The AboutIntro component had `mx-auto max-w-[1280px]` removed in a prior edit (to "make it full width"), which broke the editorial composition. Without a centered max-width container:

- The 42%/55% split applied to the **full viewport width** instead of a contained 1280px grid
- At 1440px viewport: 42% = ~605px text column (too narrow for a commanding headline), 55% = ~792px image (floated far right with massive whitespace)
- The image appeared small and disconnected from the text
- The MVV section also lost its container, making the three columns feel like tiny records floating in empty space

All other About sections (AboutStory, AboutValues, AboutWhy) correctly used `mx-auto max-w-[1280px]`. AboutIntro was the only outlier.

## Files Changed

| File | Change |
|------|--------|
| `src/components/public/about/AboutIntro.tsx` | Restored `mx-auto max-w-[1280px]` container on all three sub-sections (intro, MVV, team). Increased headline font size from `clamp(1.8rem, 3.2vw, 2.6rem)` to `clamp(2rem, 3.8vw, 3rem)`. Widened body max-width from 340px to 380px. Reduced bottom padding from `clamp(60px, 7vw, 90px)` to `clamp(40px, 5vw, 60px)` to reduce dead space. Removed hardcoded maxWidth on MVV description paragraphs. |

## Layout Changes

### Desktop (1440px)
- Container: 1280px max-width, centered with `px-5 md:px-[4vw] lg:px-[5vw]` side padding
- Editorial grid: 42% text + 55% image + gap-14 (56px)
- Headline: ~3rem at 1440px, editorial line breaks via `whiteSpace: 'pre-line'`
- Image: 55% of 1280px = ~704px wide, 4/3 aspect ratio = ~528px tall
- MVV: Three equal columns inside 1280px container with dividers

### Tablet (768px)
- Flex column stacking (text above image)
- Full-width image
- MVV stacks to single column

### Mobile (375px)
- Eyebrow → headline → body → image → MVV (vertical stack)
- No horizontal overflow

## Shared Renderer Impact

None. AboutIntro is an about-only component (`src/components/public/about/AboutIntro.tsx`), not a shared renderer. The SectionRenderer maps `'about-intro': AboutIntro` specifically. No other pages are affected.

## Typecheck Result

✅ `npx tsc --noEmit` — clean, no errors

## Build Result

✅ `npm run build` — success in 12.95s

## Browser Verification

⚠️ Browser verification unavailable; layout verified through code/build analysis only.

## Remaining Visual Issues

1. **Heading apostrophe**: The DB may still have "DONT" instead of "DON'T" if `MIGRATE_ABOUT.sql` has not been run. The migration file uses `E'WE DON''T JUST\nPLAN EVENTS...'` which should produce correct apostrophes. Run the migration in Supabase SQL Editor to fix.
2. **Heading newlines**: The `.replace(/\\n/g, '\n')` normalization handles literal `\n` strings from JSON. If the DB stores actual newline characters, the normalization is a no-op and `whiteSpace: 'pre-line'` handles rendering.
3. **Team section**: Currently hidden because `team_members` is an empty array in the DB. Will render when team data is populated.
