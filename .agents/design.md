# Design

## Overview

The repository has two designed surfaces.

- The Chrome extension popup is a `product-ui` surface.
- The Remotion compositions are `content-ui` outputs.

Popup sources are `extension/popup.html`, `extension/popup.css`, and
`extension/popup.js`. Composition sources are `src/Root.tsx` and `src/Tweet*.tsx`.

The popup provides a stable control system.
Each video style owns a distinct visual system and motion language.

## Colors

The extension popup uses a fixed dark palette in `extension/popup.css`.

| Role           | Value     |
| -------------- | --------- |
| Canvas         | `#1c1c1e` |
| Raised surface | `#2c2c2e` |
| Primary text   | `#ffffff` |
| Secondary text | `#98989d` |
| Border         | `#38383a` |
| Strong border  | `#48484a` |
| Primary action | `#0a84ff` |
| Online         | `#30d158` |
| Offline        | `#ff453a` |

Keep status labels with status colors.
Do not use the popup palette as a universal video palette.

Composition color props use `primary`, `secondary`, `background`, and
`accent`. Each component defines its own defaults.

- Minimal: `#0F172A`, `#64748B`, `#FFFFFF`, and `#0084FF`.
- Terminal: `#00FF00`, `#FFFFFF`, `#000000`, and `#00FF00`.
- Kinetic: `#1E293B`, `#0084FF`, `#F8FAFC`, and `#FF006E`.

## Typography

The popup uses the system stack from `extension/popup.css`.
Body text is `13px` with a `1.4` line height.
The product title is `18px` at weight `600`.
Primary buttons are `15px` at weight `500`.

Composition typography belongs to each template.
Minimal uses sans-serif text with a `24px` post size.
Terminal uses `Monaco, Courier, monospace` at `20px`.
Kinetic uses bold sans-serif text and frame-driven word animation.

## Layout

The popup viewport is `420px × 580px`.
Views fill the available height and keep primary actions at the bottom.
Scrollable content uses `16px` padding and reserves space for action trays.

The style track is `200px` high.
It scrolls horizontally with a `12px` gap and shows two cards at once.

All registered compositions use a `1080 × 1080` canvas at `30 fps`.
Keep important text and author details within the template padding.
Register every new template in `src/Root.tsx`.

## Elevation & Depth

Popup cards use a one-pixel border and restrained shadow.
Selected style cards add a blue border and blue-tinted shadow.
Primary buttons rise by one pixel on hover and reset when active.

Composition depth follows the selected style.
Minimal uses a soft card shadow.
Terminal uses flat panels and bordered media windows.
Kinetic uses layered images, shadows, and animated background shapes.

## Shapes

Popup primary and secondary buttons use an `8px` radius.
Style cards use `12px`; post cards use `10px`.
Icon buttons use `6px`; style checkboxes use `4px`.
Avatars and status dots are circular.

Composition shapes remain style-specific.
Minimal uses a `20px` card radius and `12px` media radius.
Terminal keeps its main panels rectangular.

## Components

The extension has these recurring components:

- The header holds the title, server status, video history, and settings.
- The post preview shows author, text, and captured media.
- The style carousel supports one or many checked templates.
- The action tray anchors capture, generation, save, and download actions.
- Settings collect the server URL, API key, duration, and image option.

Keep visible labels for form controls.
Keep icon-only button titles and meaningful image alt text.
Show selected, hover, active, online, offline, loading, success, and error states.

Render input includes post data and can include generated images, color props,
and timing props. Individual templates use only the props they declare. Drive
animation from frames with Remotion utilities. Avoid CSS time-based animation
inside rendered compositions.

## Do's and Don'ts

- Do reuse popup colors and spacing. Do not create a second popup theme.
- Do keep server state visible. Do not depend on dot color alone.
- Do retain control labels. Do not ship unlabeled icon-only actions.
- Do preserve the fixed popup bounds. Do not hide primary actions below the viewport.
- Do register new compositions. Do not add an unreachable style component.
- Do keep templates visually distinct. Do not force popup styling onto videos.
- Do derive motion from frames. Do not depend on browser wall-clock timing.
- Do disclose xAI processing. Do not describe the full flow as private or local-only.
