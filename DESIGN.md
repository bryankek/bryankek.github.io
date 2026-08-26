# Design Language Document: BERSAMA (bersama.org)

## 1. Executive Summary & Brand Vibe
*   **Platform Identity:** Parti Bersama Malaysia (Malaysian United Party)
*   **Core Message:** Inclusive representation, civic reform, check-and-balance ("Barisan Rakyat, Suara Malaysia").
*   **Visual Tone:** Civic, modern, modern-political, accessible, high-contrast, professional, and grassroots-driven.
*   **Target Audience:** Malaysian voters, youth, civic advocates, and local community members across multilingual demographics (Malay, English, Mandarin, Tamil).

---

## 2. Color Palette & Utility System

### Primary & Brand Colors
The color architecture relies heavily on contrasting national-civic tones representing solidarity and clarity.

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Base** | Deep Navy / Dark Blue | `#0E1B38` | Navigation bar, primary headers, hero backgrounds, primary text. |
| **Primary Accent** | Malaysian Yellow | `#eebd00` | CTAs, active states, key emphasis, highlights, campaign badges. |
| **Secondary Accent**| Patriot Red | `#D02B2B` | Alert banners, secondary buttons, subtle accent highlights. |
| **Background Light**| Pure White / Off-White | `#FFFFFF` / `#F8F9FA` | Main body container, card backgrounds, readable text spaces. |
| **Surface Dark** | Dark Slate | `#1A233A` | Footer, dark-mode cards, overlay containers. |

### Neutral & System Colors
*   **Text Primary:** `#0F172A` (Slate 900 — used for maximum contrast on light backgrounds)
*   **Text Secondary:** `#475569` (Slate 600 — body copy, metadata, dates)
*   **Border / Divider:** `#E2E8F0` (Slate 200 — subtle section separation)
*   **Success State:** `#10B981` (Green — submission confirmations, status badges)

---

## 3. Typography Hierarchy

The UI utilizes clean, modern, neutral sans-serif typefaces engineered for multi-script readability across Malay, English, and local dialects.

*   **Primary Typeface:** `Inter`, `Plus Jakarta Sans`, or `system-ui, -apple-system, sans-serif`
*   **Heading Typeface:** Bold, tight-letter-spaced sans-serif for strong headline presence (`weight: 700` or `800`).

### Scale & Styles
*   **H1 / Hero Title:** `36px` - `48px` | `Font Weight: 800` | `Line Height: 1.15`
*   **H2 / Section Title:** `28px` - `32px` | `Font Weight: 700` | `Line Height: 1.2`
*   **H3 / Card Header:** `20px` - `24px` | `Font Weight: 600` | `Line Height: 1.3`
*   **Body Main:** `16px` | `Font Weight: 400` | `Line Height: 1.6`
*   **Caption / Metadata:** `14px` | `Font Weight: 500` | `Color: Slate 600`

---

## 4. Layout Architecture & Grid

*   **Grid System:** 12-column responsive layout with max-width container set to `1200px` (or `72rem`).
*   **Mobile Padding:** `16px` (`px-4`) side margins.
*   **Desktop Padding:** `24px` (`px-6`) to `32px` (`px-8`) side margins.
*   **Vertical Rhythm:** Generous vertical section padding (`py-12` / `py-16` / `64px` - `96px`) to ensure distinct readability between policy manifestos, candidate profiles, and news feeds.

---

## 5. UI Components & Interactivity

### Navigation (Header)
*   **Type:** Sticky top header with solid or blurred background backdrop (`backdrop-filter: blur`).
*   **Left:** BERSAMA Logo mark + typography.
*   **Right:** Clean links (Manifesto, News/Kenyataan Media, Candidates/YB, Join Us).
*   **Language Switcher:** Compact toggle pills (`BM` | `EN` | `ZH` | `TA`).

### Call-to-Action (CTA) Buttons
*   **Primary Action Button:** 
    *   *Background:* `#eebd00` (Yellow) or `#0E1B38` (Dark Blue)
    *   *Text:* Contrast dark or white text
    *   *Shape:* Medium rounded corners (`border-radius: 8px` / `rounded-md`) or full pill (`rounded-full`)
    *   *Hover State:* Subtle lift effect (`transform: translateY(-2px)`) with shadow (`box-shadow: 0 4px 12px rgba(0,0,0,0.15)`)
*   **Secondary Action Button:**
    *   *Style:* Ghost / Outlined (`border: 2px solid #0E1B38`) with transparent background.

### Cards & Content Containers
*   **Candidate / Event Cards:** White background (`#FFFFFF`), subtle `1px` border (`#E2E8F0`), mild drop shadow (`shadow-sm`).
*   **Policy / Manifesto Containers:** Dark Navy background (`#0E1B38`) with stark white/yellow typography for high-impact visual disruption.

---

## 6. Imagery, Media & Iconography

*   **Photography Style:** High-resolution, candid, community-centric photos of leaders, volunteers, and grassroots meetings. Avoid overly artificial stock images.
*   **Iconography:** Modern line-art or subtle duotone icons (Feather / Lucide set). Used for quick scanning in manifesto bullet points, contact info, and navigation links.
*   **Banners & Badges:** Bold text overlayed on dark blue or yellow backgrounds. High contrast to ensure legibility on mobile screens.

---

## 7. Tone of Voice & Microcopy Rules

*   **Tone:** Empowering, clear, direct, civic-minded, and urgent.
*   **Brevity:** Action-oriented microcopy (e.g., *"Sertai Kami"*, *"Baca Manifesto"*, *"Semak Kawasan"*).
*   **Inclusivity:** Straightforward language avoiding unnecessary legalese or jargon.