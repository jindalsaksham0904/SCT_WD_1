# Streakly
> Make your streak impossible to ignore.

## Description
Streakly is a responsive, 3-page marketing site for a daily habit-tracking application. It solves the common problem of inconsistent tracking by visualizing your habits as an unbroken chain. The site features a clean, mint-white paper aesthetic with deep charcoal text and warm signal yellow accents. It uses a signature 7x20 grid heatmap motif that carries across the entire site to emphasize the app's core value: building a streak.

## Features
- **3-Beat Hero Animation**: A staggered wave grid load, an SVG spark travel, and a hand-drawn SVG underline on the headline.
- **Interactive Heatmap**: Grid squares act as focusable buttons with clamped tooltips revealing streak context.
- **Scroll-Triggered Reveals**: Step-by-step feature rows slide gracefully into view as you scroll.
- **Animated Stats Ticker**: Numbers count up on scroll exactly once.
- **Cohesive Motif System**: Subtle grid echoes appear in section dividers, badges, testimonials, and footers.
- **Seamless Page Transitions**: Intercepted page links provide a smooth cross-fade navigation effect.
- **Client-Side Validation**: A robust contact form that alerts you of missing or invalid fields and presents a success message on valid submission.
- **Reduced Motion Support**: Fully respects OS-level `prefers-reduced-motion` settings by instantly revealing content and skipping decorative animations.

## Tech Stack
Built entirely with:
- **HTML5** (Semantic structure)
- **CSS3** (Custom properties/tokens, flex/grid layouts, animations)
- **Vanilla JavaScript (ES6+)** (DOM manipulation, IntersectionObservers, timeouts)
- *No frameworks, no build tools, no external image files (CSS & inline SVG only).*

## How to Run Locally
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/jindalsaksham0904/SCT_WD_1.git
   ```
2. Open the directory and launch the `index.html` file in your favorite web browser. 
   - *No build step is required!* 
   - Alternatively, use a local server like `npx serve .` or Python's `python3 -m http.server 8000` to preview it seamlessly.
