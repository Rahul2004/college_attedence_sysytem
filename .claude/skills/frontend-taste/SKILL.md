---
name: frontend-taste
description: Enforce high-end design engineering taste, distinct typography, clean layouts, and intentional micro-interactions. Use this whenever writing UI code, React components, Tailwind styling, or landing pages.
---

# Frontend Taste & Anti-Slop Guidelines

## Core Philosophy

Never generate generic AI design slop. Every UI component must look like it was custom-built by a top-tier design studio (e.g., Vercel, Linear, Stripe).

## 1. Typography Rules

- **BAN THE DEFAULT INTER FONT.**
- Use modern, high-contrast pairings: `Geist`, `Satoshi`, `Outfit`, or `Plus Jakarta Sans` for display headers.
- Always add tight letter-spacing (`tracking-tight` or `tracking-tighter`) to large headings.

## 2. Color & Styling Discipline

- **NO LAZY GRADIENTS:** Do not splash random purple-to-blue glowing background blobs behind sections.
- Use a disciplined, restrained color palette: monochromatic/neutral foundation with a single, high-impact accent color (e.g., emerald, amber, or crisp indigo).
- Implement subtle borders (`border border-white/10` or `border-zinc-800/80`) instead of heavy drop shadows to define layout cards.

## 3. Layout & Structure

- Avoid boring, identical 3-column symmetrical cards.
- Use asymmetrical grids, dense data arrangements, or clean editorial whitespace.
- Every container must have intentional internal padding (e.g., `p-6` or `p-8`), not cramped default spacing.

## 4. Micro-Interactions & States

- Components must never feel static or dead. Explicitly include transition properties (`transition-all duration-200 ease-out`).
- Always add distinct hover states, focus rings for accessibility, and skeleton loading states for asynchronous data.
