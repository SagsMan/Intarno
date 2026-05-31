# Intarno — Contemporary Furniture & Interior Design

A fully responsive React + TypeScript + Tailwind CSS implementation inspired by [BoConcept](https://www.boconcept.com), featuring Danish-inspired furniture design aesthetics.

---

## 🗂 Project Structure

```
intarno/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx        # Full-viewport hero with parallax image
│   │   │   ├── CategoryGrid.tsx       # 9-category icon grid
│   │   │   ├── FeaturedProducts.tsx   # Featured product cards
│   │   │   ├── MidBanner.tsx          # Split-screen armchair feature
│   │   │   ├── RoomInspiration.tsx    # Room inspiration mosaic
│   │   │   ├── CraftsmanshipSection.tsx  # Heritage dark-bg section
│   │   │   ├── InspirationArticles.tsx   # Blog/guide cards
│   │   │   └── CTASection.tsx         # 4-column CTA grid
│   │   ├── layout/
│   │   │   ├── Layout.tsx             # Root layout wrapper
│   │   │   ├── AnnouncementBar.tsx    # Dismissible top bar
│   │   │   ├── Header.tsx             # Sticky header with mega menu
│   │   │   ├── MegaMenu.tsx           # Dropdown mega navigation
│   │   │   ├── MobileMenu.tsx         # Slide-out mobile drawer
│   │   │   └── Footer.tsx             # Full-featured footer
│   │   └── ui/
│   │       ├── ProductCard.tsx        # Product card with hover, wishlist, quick-view
│   │       └── SearchOverlay.tsx      # Full-screen search with live results
│   ├── data/
│   │   ├── navigation.ts              # Nav structure, footer links
│   │   └── products.ts                # Products, categories, helpers
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx               # Filterable product grid
│   │   ├── ProductPage.tsx            # Product detail with accordion
│   │   ├── CollectionsPage.tsx
│   │   ├── RoomsPage.tsx
│   │   ├── InspirationPage.tsx
│   │   ├── ContactPage.tsx            # Contact form + info
│   │   ├── AboutPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── styles/
│   │   └── index.css                  # Tailwind base + custom utilities
│   ├── App.tsx                        # Router configuration
│   └── main.tsx                       # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/intarno.git
cd intarno

# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in /dist

# Preview production build locally
npm run preview
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM renderer |
| react-router-dom | ^6.22.0 | Client-side routing |
| lucide-react | ^0.363.0 | Icons |
| framer-motion | ^11.0.8 | Animations (optional enhancement) |
| clsx | ^2.1.0 | Conditional classnames |
| tailwindcss | ^3.4.1 | Utility-first CSS |
| vite | ^5.2.0 | Build tool |
| typescript | ^5.2.2 | Type safety |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

### GitHub Pages

```bash
# In vite.config.ts, add: base: '/intarno/'
npm run build
npx gh-pages -d dist
```

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `intarno-black` | `#0a0a0a` | Primary text, CTAs |
| `intarno-white` | `#fafaf8` | Page background |
| `intarno-cream` | `#f5f2ed` | Section backgrounds, cards |
| `intarno-charcoal` | `#2a2a2a` | Secondary text |
| `intarno-mid` | `#6b6b6b` | Body copy, labels |
| `intarno-light` | `#b8b4ad` | Borders, muted elements |
| `intarno-accent` | `#c8a96e` | Gold accent, highlights |

### Typography
- **Display / Headings**: Cormorant Garamond (serif, light weight)
- **Body / UI**: DM Sans (sans-serif, 300–500)

### Key Components
- `.btn-primary` — solid black CTA
- `.btn-secondary` — outlined CTA
- `.btn-ghost` — underlined text link
- `.section-title` — large display heading
- `.eyebrow` — uppercase tracking label
- `.card-hover` — subtle scale on hover

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 768px | Single column, mobile nav drawer |
| Tablet | 768px–1024px | 2-column grids, condensed nav |
| Desktop | > 1024px | Full mega menu, 4-column grids |

---

## 🔧 Customisation

### Adding Products
Edit `src/data/products.ts` — add entries following the `Product` interface.

### Adding Pages
1. Create `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav link in `src/data/navigation.ts`

### Swapping Images
All product and editorial images use Unsplash URLs. Replace with your own CDN URLs in `products.ts` and individual page components.

---

## 📋 Features Implemented

- ✅ Sticky header with mega-menu navigation (desktop)
- ✅ Mobile slide-out drawer with accordion categories  
- ✅ Full-screen search overlay with live product filtering
- ✅ Dismissible announcement bar
- ✅ Hero section with gradient overlay
- ✅ Category icon grid
- ✅ Product cards with wishlist, hover second image, quick-view, sale badges
- ✅ Filterable shop page with sort and category pills
- ✅ Product detail page with image gallery, colour swatches, accordion specs
- ✅ Collections grid with hero images
- ✅ Rooms inspiration grid
- ✅ Inspiration/blog page with featured article
- ✅ Contact form with validation
- ✅ About page with stats section
- ✅ Full footer with newsletter signup, social links, legal
- ✅ 404 page
- ✅ Scroll-to-top on route change
- ✅ Lazy image loading throughout
- ✅ Full mobile responsiveness
- ✅ CSS animations (fade-up, slide-down, img-reveal)
