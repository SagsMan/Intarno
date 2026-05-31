export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
  featured?: {
    image: string
    title: string
    href: string
  }[]
}

export const navItems: NavItem[] = [
  {
    label: 'Furniture',
    href: '/shop',
    children: [
      { label: 'Sofas', href: '/shop/sofas' },
      { label: 'Chairs', href: '/shop/chairs' },
      { label: 'Tables', href: '/shop/tables' },
      { label: 'Storage', href: '/shop/storage' },
      { label: 'Beds', href: '/shop/beds' },
      { label: 'Outdoor', href: '/shop/outdoor' },
      { label: 'Lamps', href: '/shop/lamps' },
      { label: 'Rugs', href: '/shop/rugs' },
      { label: 'Accessories', href: '/shop/accessories' },
    ],
    featured: [
      {
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
        title: 'Sofas',
        href: '/shop/sofas',
      },
      {
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
        title: 'Chairs',
        href: '/shop/chairs',
      },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'Sofa Collections', href: '/collections/sofas' },
      { label: 'Table Collections', href: '/collections/tables' },
      { label: 'Chair Collections', href: '/collections/chairs' },
      { label: 'Armchair Collections', href: '/collections/armchairs' },
      { label: 'Bed Collections', href: '/collections/beds' },
      { label: 'Storage Collections', href: '/collections/storage' },
      { label: 'Fabric & Leather', href: '/collections/fabrics' },
      { label: 'Outlet', href: '/shop/outlet' },
    ],
    featured: [
      {
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
        title: 'New Collection',
        href: '/collections',
      },
    ],
  },
  {
    label: 'Rooms',
    href: '/rooms',
    children: [
      { label: 'Living Rooms', href: '/rooms/living' },
      { label: 'Dining Rooms', href: '/rooms/dining' },
      { label: 'Bedrooms', href: '/rooms/bedrooms' },
      { label: 'Outdoor Spaces', href: '/rooms/outdoor' },
      { label: 'Small Spaces', href: '/rooms/small' },
      { label: 'Home Offices', href: '/rooms/offices' },
    ],
  },
  {
    label: 'Inspiration',
    href: '/inspiration',
  },
  {
    label: 'About',
    href: '/about',
  },
]

export const footerLinks = {
  shop: [
    { label: 'Sofas', href: '/shop/sofas' },
    { label: 'Chairs', href: '/shop/chairs' },
    { label: 'Tables', href: '/shop/tables' },
    { label: 'Beds', href: '/shop/beds' },
    { label: 'Storage', href: '/shop/storage' },
    { label: 'Outdoor', href: '/shop/outdoor' },
    { label: 'Lamps', href: '/shop/lamps' },
    { label: 'Rugs & Accessories', href: '/shop/accessories' },
  ],
  company: [
    { label: 'About Intarno', href: '/about' },
    { label: 'Our Designers', href: '/about#designers' },
    { label: 'Craftsmanship', href: '/about#craft' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press', href: '/about#press' },
  ],
  services: [
    { label: 'Interior Design Service', href: '/contact' },
    { label: 'Free Fabric Samples', href: '/contact#samples' },
    { label: 'Find a Store', href: '/contact#stores' },
    { label: 'Delivery Information', href: '/contact#delivery' },
    { label: 'Product Care', href: '/contact#care' },
    { label: 'Warranty', href: '/contact#warranty' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
}
