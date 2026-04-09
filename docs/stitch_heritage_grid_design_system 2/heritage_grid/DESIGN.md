# Design System Strategy: The Alabaster Precision

## 1. Overview & Creative North Star
**The Creative North Star: "The Curated Laboratory"**

This design system is a sophisticated dialogue between heritage warmth and scientific rigor. It rejects the sterile coldness of typical "clinical" interfaces and the cluttered noise of "luxury" branding. Instead, it occupies a space we call *The Curated Laboratory*: a place where high-end editorial aesthetics meet the uncompromising precision of a data-driven environment.

To move beyond "template" UI, designers must embrace **Intentional Asymmetry**. While the grid is the foundation, the layout should feel like a premium printed journal. This is achieved through large, confident negative space, typography that isn't afraid to be oversized, and a "Bento-Grid" philosophy where information is compartmentalized into discrete, beautiful containers that vary in scale and density.

---

## 2. Colors & Surface Philosophy
The palette is anchored in a warm, "Alabaster" foundation (`#fdf9f0`) that feels organic and human, contrasted by the authoritative `primary` Forest Green (`#154212`) and the high-energy `secondary` Vibrant Lime (`#d2f000`).

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They create visual friction and cheapen the "Quiet Luxury" aesthetic. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Tonal Transitions:** Using the `surface-container` tiers to distinguish functional areas.

### Surface Hierarchy & Nesting
Treat the interface as a physical stack of premium materials. Use the following hierarchy to create depth:
*   **Base Layer:** `background` (#fdf9f0) – The canvas.
*   **Secondary Layer:** `surface-container-low` (#f7f3ea) – Inset areas or secondary content.
*   **Interactive/Elevated Layer:** `surface-container-lowest` (#ffffff) – Used for primary cards or data modules to make them "pop" against the warmer background.

### The "Glass & Gradient" Rule
To avoid a flat, "Bootstrap" appearance, use semi-transparent overlays for floating panels. Main CTAs should utilize a subtle linear gradient (e.g., `secondary` to `secondary_container`) to provide a tactile, "lit from within" quality that solid hex codes cannot replicate.

---

## 3. Typography: The Editorial Voice
We utilize **DM Sans** for its geometric yet approachable character, paired with **JetBrains Mono** for technical data to reinforce "Clinical Precision."

*   **Display & Headlines (DM Sans, 600+):** Large, bold, and authoritative. Headlines should act as visual anchors. Use `headline-lg` (2rem) for major section starts to establish an editorial rhythm.
*   **Body (DM Sans, 400):** Clean and legible. Stick to `body-md` (0.875rem) for primary information to maintain a sense of lightness.
*   **Labels (DM Sans, 500, Uppercase):** Used for micro-copy and eyebrow headers. The uppercase treatment adds a sense of "archival" classification.
*   **Technical Data (JetBrains Mono):** Use for timestamps, ID numbers, or financial figures. It signals to the user that this specific information is precise and "system-generated."

---

## 4. Elevation & Depth
In this system, depth is felt rather than seen. We move away from structural lines toward **Tonal Layering.**

*   **The Layering Principle:** Soft, natural lift is achieved by placing a `surface-container-lowest` (#FFFFFF) card onto a `surface-container-low` (#f7f3ea) background. No shadow is required for this level of hierarchy.
*   **Ambient Shadows:** For floating elements (Modals, Popovers), use a highly diffused shadow: `0 4px 16px rgba(45,90,39,0.06)`. Notice the shadow is tinted with our Forest Green, not grey, to maintain color harmony.
*   **The "Ghost Border":** If a container requires a boundary (e.g., in a complex data grid), use the `outline-variant` token at **10% opacity**. It should be a suggestion of a line, not a barrier.
*   **Backdrop Blur:** Use `blur(12px)` on navigation bars or sidebars that overlap content, creating a "frosted glass" effect that allows the warm background tones to bleed through.

---

## 5. Components

### Buttons: The High-Contrast Pulse
*   **Primary (CTA):** Vibrant Lime (`secondary_fixed`) background with Forest Green (`on_secondary_fixed`) text. 
    *   **Radius:** 12px (`md`).
    *   **Label:** Uppercase DM Sans 500.
    *   **Effect:** A subtle 2px inner-glow gradient for a "premium-plastic" feel.
*   **Secondary:** Forest Green (`primary`) background with White text. Used for persistent actions.
*   **Tertiary:** Ghost style. No background, Forest Green text, uppercase, with a 10% Forest Green border on hover.

### The Bento Card
*   Forbid the use of divider lines within cards.
*   Use `surface-container-lowest` (#FFFFFF).
*   **Radius:** 16px (`lg`) for standard cards; 24px (`xl`) for large hero sections.
*   **Padding:** Strict adherence to 24px or 32px padding to ensure "Quiet Luxury" through breathing room.

### Navigation & Sidebar
*   **Sidebar:** Solid Forest Green (`primary_container`). 
*   **Active State:** Use the Vibrant Lime (`secondary_container`) for the indicator or icon color to create a high-contrast "active" signal.
*   **Typography:** Labels should be DM Sans 500 Uppercase at `label-md` size.

### Inputs & Fields
*   **Background:** `surface-container-highest`.
*   **Active State:** A 1px "Ghost Border" (20% opacity Forest Green) appears only on focus. 
*   **Labels:** Floating labels using JetBrains Mono for a "data-entry" aesthetic.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Overlapping Elements:** Let an image or a card slightly break the boundary of the section below it to create a bespoke, non-webby look.
*   **Embrace the "Monospaced Accent":** Use JetBrains Mono for small details like "Page 01/10" or "Last Updated."
*   **Apply "White Space as a Divider":** Use 48px+ gaps to separate major sections instead of lines.

### Don’t:
*   **No Pure Black:** Never use `#000000`. Use `on_surface` (#1c1c16) for all text to keep the look soft.
*   **No Heavy Shadows:** If a shadow looks "dark," it’s wrong. It should look like a soft glow of light.
*   **No Standard 1px Borders:** If you feel the need to add a border, try changing the background color of the container by one tonal step instead.
*   **No Dark Mode:** This system is strictly calibrated for a light, "Alabaster" experience. Transforming it to dark mode would destroy the "Heritage" feel.