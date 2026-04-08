

# Interactive Wall Calendar Component

## Overview
A polished, interactive wall calendar inspired by the reference image — featuring a physical wall calendar aesthetic with hero imagery, date range selection, integrated notes, and creative extras.

## Pages & Layout
- **Single-page app** with a centered wall calendar component that looks like a real hanging calendar
- Wire/spiral binding visual at the top for realism
- Drop shadow to give a "hanging on wall" feel

## Calendar Structure

### Top Half — Hero Image Panel
- Large scenic photo area (using Unsplash placeholder images, one per month)
- Decorative wave/diagonal clip overlay (matching the blue accent in the reference)
- Month name and year badge overlaid on the image

### Bottom Half — Date Grid & Notes
- **Left side**: Notes section with lined paper aesthetic (like the reference)
- **Right side**: Mon–Sun grid with proper date layout
- Saturday/Sunday dates highlighted in blue (matching reference)
- Previous/next month overflow dates in muted gray

## Core Features

### 1. Date Range Selector
- Click to set start date, click again for end date
- Visual states: start (filled circle), end (filled circle), in-between (highlighted background band)
- Click a third time to reset selection

### 2. Integrated Notes
- General monthly notes area (left side, lined)
- Per-date-range notes: when a range is selected, a note input appears
- Notes persist in localStorage

### 3. Month Navigation
- Left/right arrows to navigate months
- Smooth transition animation between months

### 4. Responsive Design
- **Desktop**: Side-by-side layout honoring the reference aesthetic
- **Mobile**: Stacked vertically — image on top, calendar below, notes collapsible

## Creative Extras
- 🎨 **Theme switching**: Calendar accent color changes per month (warm tones for summer, cool for winter)
- 📅 **Holiday markers**: US holidays shown as small dots on dates
- 🔄 **Page flip animation**: Smooth CSS transition when changing months
- 🌙 **Dark mode toggle**: Light/dark theme switch
- ✨ **Today indicator**: Pulsing dot on today's date
- 📌 **Date range summary**: Shows "X days selected" with formatted date range

## Tech Approach
- React components with TypeScript
- Tailwind CSS for styling
- localStorage for notes persistence
- CSS animations for page transitions
- Fully client-side, no backend

