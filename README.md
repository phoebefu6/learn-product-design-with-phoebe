# learn-product-design-with-phoebe

**Six sessions, 45 minutes each, one real screen from problem statement to engineering handoff.**

Live: https://phoebefu6.github.io/learn-product-design-with-phoebe/

The running project is **Daybreak's "Manage your subscription" area** - the screen where a coffee
subscriber pauses, skips, changes their grind or cancels. It is the highest-stakes surface the
company owns, because it is the only screen where the customer is deciding whether to keep
paying, and right now the button that saves the relationship is two taps behind the one that
ends it.

Deliberately AI-agnostic. Every judgement in the course is one a tool cannot make for you.

## Sessions

1. Before pixels - problem, person, metric, and sizing it on paper
2. Research that changes it - the pre-registered guess, and quotes to decisions
3. Structure and flow - the cost of nesting, ugly wireframes, the states trio
4. **The visual system** - scales, hierarchy, and the screen scorer
5. Interaction and copy - feedback, microcopy, forms, motion
6. Critique and handoff - running one, receiving one, and the pack

## The screen scorer

`assets/pd-live.js` renders a live Daybreak screen that re-renders as you toggle design levers.

**The contrast row is genuinely measured.** It walks the rendered mock, reads `getComputedStyle`
on every text element, resolves the effective background, and computes the real WCAG 2.1
relative-luminance ratio. Change a colour and the number changes because the pixels changed.
Hierarchy, spacing, copy, states and findability are a stated teaching rubric - the widget footer
says which is which.

The ladder, verified in-browser: **0 → 30 → 50 → 62 → 76 → 88 → 100**, with measured contrast
going from 2.64:1 to 9.30:1 and time-to-find-pause from 41s to 5s.

Then the **anti-lever**: "brighten it up, make it feel more friendly" takes 100 down to **58**,
with measured contrast collapsing to **1.67:1**. Nothing is penalised for being bright - the
pastel text genuinely fails, and four accent colours means no action reads as primary. The
measurement does the arguing.

## Structure

```
index.html                        landing, mindmap, paths
courses/01..06-*.html             the six sessions
assets/style.css                  editorial-bold, deep violet + coral
assets/app.js                     accordions, quizzes, passport, widget kit
assets/mindmap.js                 radial knowledge map
assets/pd-live.js                 the screen scorer
materials/official-course-map.md  source map, coverage tables, the full rubric
materials/widget-kit.md           markup contracts for the interactive components
```

Static HTML, no build step:

```bash
python3 -m http.server 8000
```

by Phoebe Fu · part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/)
