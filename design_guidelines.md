# Aqeel Pharmacy E-Commerce Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from leading pharmacy and e-commerce platforms:
- **Primary References**: Shopify storefronts, modern pharmacy sites (CVS, Walgreens digital), and the partner site shaheenchemistrwp.com
- **Design Principles**: 
  - Professional trust-building (medical/pharmacy context)
  - Product-first visual hierarchy
  - Conversion-optimized layouts
  - Clean, modern aesthetic with breathing room

## Typography System

**Font Stack**: 
- **Primary**: Inter or DM Sans (Google Fonts) - clean, professional, highly legible
- **Accent**: Optional Poppins for headings (adds friendly warmth appropriate for healthcare)

**Hierarchy**:
- **Hero Headlines**: text-4xl md:text-5xl lg:text-6xl, font-bold
- **Section Headers**: text-3xl md:text-4xl, font-semibold
- **Product Titles**: text-xl md:text-2xl, font-semibold
- **Category Labels**: text-lg, font-medium, uppercase tracking-wide
- **Body Text**: text-base, font-normal, leading-relaxed
- **Price Primary**: text-2xl md:text-3xl, font-bold
- **Price Secondary**: text-sm, line-through when showing discounts
- **Metadata/Labels**: text-sm, font-medium

## Layout & Spacing System

**Tailwind Spacing Primitives**: Use 4, 6, 8, 12, 16, 20, 24 as primary units
- **Component spacing**: p-4, p-6, p-8
- **Section padding**: py-12 md:py-16 lg:py-24
- **Grid gaps**: gap-4, gap-6, gap-8
- **Container**: max-w-7xl mx-auto px-4 md:px-6 lg:px-8

**Grid Systems**:
- **Product Grids**: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- **Category Cards**: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- **Featured Products**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Core Component Library

### Navigation
- **Header**: Sticky top navigation with logo left, search center, cart/account right
- **Mega Menu**: Category dropdowns with subcategory columns and brand lists
- **Mobile**: Hamburger menu with slide-out drawer, full-screen category navigation
- **Search Bar**: Prominent with instant suggestions dropdown

### Product Cards
- **Image Container**: aspect-square with hover zoom effect
- **Card Structure**: Image → Brand badge → Title → Price → Quick add button
- **Hover State**: Subtle lift (shadow-lg), reveal secondary image or quick view
- **Sale Badge**: Absolute positioned top-right corner

### Product Detail Page
- **Layout**: 2-column (md:grid-cols-2)
  - Left: Large image gallery with thumbnails
  - Right: Brand → Title → Price → Description → Stock indicator → Add to cart CTA → Product details accordion
- **Image Gallery**: Main image with 4-6 thumbnail grid below, click to swap
- **Trust Elements**: Authentic product badge, return policy link, secure checkout icon

### Shopping Cart
- **Slide-out Panel**: Right-side overlay (not full page)
- **Cart Items**: Product thumbnail → Name → Quantity selector → Price → Remove
- **Sticky Footer**: Subtotal → Checkout CTA

### Checkout Flow
- **Multi-step Indicator**: Step 1: Info → Step 2: Shipping → Step 3: Review
- **Form Layout**: Single column, grouped sections with clear labels
- **Order Summary**: Sticky sidebar on desktop showing cart contents

### Category Pages
- **Filters Sidebar**: Collapsible on mobile, persistent on desktop
- **Filter Groups**: Category, Brand, Price Range (slider), Stock Status
- **Product Grid**: Responsive with sort dropdown (Newest, Price Low-High, Popular)
- **Pagination**: Load more button or infinite scroll

### Admin Dashboard
- **Sidebar Navigation**: Collapsed on mobile, expanded on desktop
- **Dashboard Cards**: Metrics in 2x2 or 3-column grid (Total Orders, Revenue, Low Stock, New Customers)
- **Data Tables**: Responsive with row actions, status badges, search/filter
- **Forms**: Clean, grouped fields with validation states

### Brand Showcase
- **Grid Layout**: Logo cards in grid-cols-3 md:grid-cols-4 lg:grid-cols-6
- **Hover Effect**: Subtle scale + shadow, links to brand filter

## Homepage Layout

**Hero Section**: 
- Full-width image slider/carousel (h-[500px] md:h-[600px] lg:h-[700px])
- Overlaid headline + CTA with blurred background button treatment
- 2-3 slides showcasing seasonal promotions, new arrivals, or featured categories

**Featured Categories**:
- 8-9 category cards in responsive grid
- Large imagery with category name overlay
- Direct links to category pages

**Popular Products**:
- Horizontal scrollable section or grid
- "Shop All" link to full catalog

**Brand Showcase**:
- Logo grid section

**Trust Indicators**:
- 3-column feature grid: Free Delivery, Authentic Products, Easy Returns
- Icon + Short description

**Newsletter/Contact**:
- 2-column split: Newsletter signup form + Contact info/social links

## Images Strategy

**Hero Images**: 
- 3 rotating banners showcasing seasonal collections, promotions, featured products
- Lifestyle photography with pharmacy/wellness themes
- Dimensions: 1920x700px minimum

**Product Images**:
- Clean white background product shots (primary)
- Lifestyle/usage context (secondary)
- Minimum 800x800px, multiple angles

**Category Banners**:
- Aspirational lifestyle imagery representing each category
- 1200x400px banners for category pages

**Brand Logos**:
- Transparent PNG logos on clean backgrounds
- Consistent sizing in showcase grid

**Trust/Feature Icons**:
- Use Heroicons or Font Awesome for consistency
- Delivery truck, shield (authentic), refresh (returns), etc.

## Mobile-First Considerations
- Touch-friendly tap targets (min 44x44px)
- Thumb-zone optimized navigation
- Collapsible filters as bottom sheet
- Sticky "Add to Cart" on product detail pages
- Simplified checkout flow (fewer fields per screen)

This design system balances professional healthcare aesthetics with modern e-commerce conversion optimization, creating trust while maintaining a clean, fast user experience.