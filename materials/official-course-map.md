# Official course map - learn-product-design-with-phoebe

Six sessions, 45 minutes each, one running project: **design Daybreak's "Manage your
subscription" area**, from the problem statement to the engineering handoff.

Daybreak is the coffee-subscription brand from `learn-sql-with-phoebe` and the warehouse and
system-design courses. The scope note: it is a direct-to-consumer subscription, not a
marketplace, so the running project is the **subscriber self-serve area** - the screen where
someone pauses, skips, changes grind, or cancels. That is the highest-stakes surface the company
has, because it is the only screen where the customer is deciding whether to keep paying.

Written and verified 2026-08-26.

---

## What this course is NOT

| If the question is | The course is |
|---|---|
| How do I use AI tools to make design assets faster? | `learn-ai-design-with-phoebe` |
| How does product management change when drafting is free? | `learn-ai-pm-with-phoebe` |
| How do I build the front end? | `learn-html-with-phoebe` |
| **How do I design a product that works for the person using it, and hand it over so it survives?** | **this course** |

This course is AI-agnostic on purpose. Every judgement in it - what the problem is, what the
research said, where the hierarchy goes, whether the contrast passes - is a judgement a tool
cannot make for you, which is exactly why it keeps its value.

---

## Session coverage

Legend: ✓ taught in full · ◐ touched, with the depth pointed elsewhere

### Session 1 - Before pixels
| Source | | Covered |
|---|---|---|
| Problem framing before solution framing | ✓ | who is hurting, when, what would change if it stopped. No screens allowed in this block |
| Jobs to be done, used as a question rather than a template | ✓ | "what were you trying to get done, and what did you do instead" |
| The one metric, and why a design needs one | ✓ | Daybreak's is cancellations that begin with a failed pause attempt |
| Outcome over output | ✓ | "we shipped a redesign" is an output; "pause attempts that succeed" is an outcome |
| Opportunity sizing on the back of an envelope | ✓ | volume x rate x value, done in three minutes before any design work is committed |
| Product strategy and roadmapping | ◐ | pointed at `pm-skills` and `learn-ai-pm-with-phoebe`. This session only sizes one problem |

### Session 2 - Research that changes the design
| Source | | Covered |
|---|---|---|
| Five interviews, and why the number is small | ✓ | you are looking for the shape of a problem, not a population estimate. Say that out loud rather than pretending to a sample |
| Question design that avoids leading | ✓ | ask about the last time it happened, never about what they would like |
| Quotes to insights to opportunities | ✓ | the three-column move, done live on real quotes |
| Confirmation bias, and the pre-registered guess | ✓ | write down what you expect to find BEFORE the interviews. The gap is the finding |
| Behavioural evidence against stated preference | ✓ | what people did in the funnel against what they said in the room, and what to do when they disagree |
| Survey design, statistical significance | ◐ | this is qualitative discovery. Quantitative method lives in `learn-experimentation-with-phoebe` |

### Session 3 - Structure and flow
| Source | | Covered |
|---|---|---|
| Information architecture as the cost of nesting | ✓ | every level of nesting loses people. The action that prevents a cancellation must not be deeper than the one that causes it |
| Task flows before screens | ✓ | drawn as steps a person takes, not as pages you will build |
| Low-fidelity wireframes, and why fidelity is a trap | ✓ | a polished mock gets feedback on the polish. A grey box gets feedback on the structure |
| The empty, loading and error trio | ✓ | designed as first-class states, because on this screen they are the common case |
| Progressive disclosure, and when it is an excuse | ✓ | hiding complexity is good; hiding the primary task is a menu problem wearing a design word |
| Card sorting, tree testing | ◐ | named as the methods that validate an IA. Running them is out of scope |

### Session 4 - The visual system · **the scorer lands here**
| Source | | Covered |
|---|---|---|
| Type scale | ✓ | a small ratio-based set of sizes, and why three sizes used consistently beats nine used expressively |
| Spacing scale | ✓ | one scale, and proximity as the cheapest grouping signal available |
| Colour and WCAG 2.1 contrast | ✓ | relative luminance, the 4.5:1 AA threshold for body text, 3:1 for large text, 7:1 for AAA. **Computed live in the browser on the real rendered colours** |
| Visual hierarchy | ✓ | one primary action per screen. Five equal buttons is five decisions |
| Tokens as the output of the session | ✓ | the scale becomes named values a developer can use, which is what makes session 6's handoff possible |
| Brand systems, illustration, motion craft | ◐ | pointed at Phoebe's design-partner skills and `learn-ai-design-with-phoebe` |

### Session 5 - Interaction and copy
| Source | | Covered |
|---|---|---|
| Feedback for every action | ✓ | the person must know it worked, and know it within about a second |
| Microcopy as interface, not decoration | ✓ | button labels name the task; error messages say what happened, whether anything changed, and what to do |
| Forms, and the fields you should not have | ✓ | every field is a chance to lose someone. The cheapest form improvement is deletion |
| Motion budget | ✓ | motion clarifies causation and location. Anything longer than about 300ms on a repeated action becomes a tax |
| Destructive actions and confirmation | ✓ | confirm only what is irreversible, and make the confirmation name the consequence rather than asking "are you sure" |
| Accessibility beyond contrast | ◐ | focus order, targets, labels and reduced motion are named. Full audit method lives in the a11y skills |

### Session 6 - Critique and handoff
| Source | | Covered |
|---|---|---|
| Running a critique that produces decisions | ✓ | state the goal and the constraint first; ask for problems, not solutions; the designer holds the pen |
| Receiving critique without defending | ✓ | the two-question reply that turns an opinion into usable information |
| The handoff pack | ✓ | tokens, states, edge cases, copy deck, and the behaviours that are not visible in a mock |
| What to measure after ship | ✓ | the one metric from session 1, plus a guardrail metric so you notice what you broke |
| Design debt, and writing it down | ✓ | the things you knowingly shipped wrong, with the reason, so the next person does not re-litigate them |
| Design systems at scale, governance | ◐ | this course produces one screen's tokens. System governance lives in the styleseed and design-system skills |

---

## The scorer: `assets/pd-live.js`

A live Daybreak "Manage your subscription" screen that re-renders as levers are toggled.

**The contrast row is genuinely measured, not scripted.** It walks the rendered mock, reads
`getComputedStyle` on every text-bearing element, resolves the effective background up the tree,
and computes the real WCAG 2.1 relative-luminance ratio. The palettes are applied to the DOM, so
the number changes because the pixels changed. The fake browser chrome at the top of the mock is
excluded from measurement - it is not part of the surface being designed, and leaving it in
capped the score at a number no lever could move.

The other five rows - hierarchy, spacing, copy, states, findability - are a teaching model. The
widget's own footer says which is which.

**The ladder, verified in-browser on 2026-08-26. These are the numbers the session pages quote.**

| Lever added | Score | Measured contrast | Time to find pause |
|---|---|---|---|
| the screen we inherited | 0/100 | 2.64:1 fails AA | 41 s |
| + text colours that meet AA | 30/100 | 9.16:1 AAA | 41 s |
| + one primary action | 50/100 | 9.30:1 | 36 s |
| + one spacing scale | 62/100 | 9.30:1 | 36 s |
| + task-named copy | 76/100 | 9.30:1 | 27 s |
| + empty, loading and error states | 88/100 | 9.30:1 | 27 s |
| + pause on the screen, not in a menu | **100/100** | 9.30:1 | **5 s** |
| **all of the above, then "brighten it up"** | **58/100** | **1.67:1 fails AA** | **11 s** |

Rubric: contrast 30 points (30 at AAA, 24 at AA, 12 above 3:1, 0 below), hierarchy 20, spacing
12, task-named copy 14, states 12, findability 12.

### The anti-lever

"Brighten it up, make it feel more friendly" is the most-requested change in design history, and
it is modelled as an **anti-lever**: it never raises the score, and it visibly backfires. Pastel
text on white drops the measured ratio from 9.30 to 1.67 - a real accessibility failure computed
on the real colours, not a scripted penalty. Four competing button colours cut the hierarchy
score from 20 to 8, because a screen with four accent colours no longer says which action
matters. Time to find pause goes from 5 seconds to 11.

The point is not that colour is bad. The point is that **the measurement does the arguing**, and
a designer who can put a real 1.67:1 on the table wins a conversation that opinion cannot.

This is the same shape as the detector anti-lever in `learn-ai-education-with-phoebe`: a toggle
the learner is expected to reach for, which teaches by failing honestly.

---

## Verified external anchors

- **WCAG 2.1 contrast minimums.** 4.5:1 for normal text (AA), 3:1 for large text, 7:1 for AAA.
  The relative-luminance formula implemented in `pd-live.js` is the one from the specification.
  https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- **Jobs to be done** is used as an interview stance, not a framework to fill in: ask about the
  last time the person tried to do the thing.
- **Nesting cost.** Treated as a design heuristic in this course, argued from Daybreak's own
  funnel rather than from a cited universal figure. Where the course quotes a number about
  Daybreak, that number is part of the teaching scenario and the page says so.
- Everything on the scorer other than the contrast row is a teaching model, calibrated so that
  each trade is visible. The widget footer and this file both say it.

Certificates, videos and graded assessments stay with the official providers. This course teaches
the working craft and says plainly where it stops.
