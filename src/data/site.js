import { unsplash } from '../utils/images'

export const SITE = {
  name: 'GULLY RACK',
  tagline: 'Curated Streetwear & Essentials',
  url: 'https://gullyrack.in',
  email: 'hello@gullyrack.in',
  instagram: 'gullyrack',
  instagramUrl: 'https://www.instagram.com/gullyrack',
}

export const SHIPPING = {
  freeThreshold: 999,
  standardFee: 79,
  expressFee: 149,
}

export const ANNOUNCEMENTS = [
  { text: `Free shipping on orders above ₹${SHIPPING.freeThreshold}`, to: '/shipping' },
  { text: 'New drops every Friday', to: '/shop?collection=new' },
  { text: 'Every pre-loved piece is graded', to: '/faqs' },
]

export const NAV_LINKS = [
  { label: 'Shop All', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?collection=new' },
  { label: 'Tees', to: '/shop?category=t-shirts' },
  { label: 'Hoodies', to: '/shop?category=hoodies-sweatshirts' },
  { label: 'Jackets', to: '/shop?category=jackets' },
  { label: 'Pre-Loved', to: '/shop?condition=Pre-Loved' },
  { label: 'About', to: '/about' },
]

export const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'Shop All', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?collection=new' },
      { label: 'Trending', to: '/shop?collection=trending' },
      { label: 'Pre-Loved', to: '/shop?condition=Pre-Loved' },
      { label: 'New Essentials', to: '/shop?condition=New' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQs', to: '/faqs' },
      { label: 'Shipping & Delivery', to: '/shipping' },
      { label: 'Returns & Refunds', to: '/returns' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Gully Rack',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
]

export const WHY_SHOP = [
  {
    icon: 'BadgeCheck',
    title: 'Hand-Checked & Graded',
    text: 'Every pre-loved piece is inspected, cleaned and given an honest condition grade before it hits the rack.',
  },
  {
    icon: 'Tag',
    title: 'Honest Prices',
    text: 'Streetwear you actually want, priced for students and first jobs — not resale markups.',
  },
  {
    icon: 'Recycle',
    title: 'Wear It Again',
    text: 'Buying pre-loved keeps good clothes in rotation and out of landfill. Style that is lighter on the planet.',
  },
  {
    icon: 'Truck',
    title: 'Fast Pan-India Shipping',
    text: `Dispatched in 1–2 business days. Free shipping on orders above ₹${SHIPPING.freeThreshold}.`,
  },
]

export const INSTAGRAM_POSTS = [
  { id: 'ig-1', image: unsplash('1564859228273-274232fdb516'), alt: 'Back view of a white tee and cap on the street' },
  { id: 'ig-2', image: unsplash('1515886657613-9f3515b0c78f'), alt: 'Yellow tracksuit look against a blue sky' },
  { id: 'ig-3', image: unsplash('1516826957135-700dedea698c'), alt: 'Light-wash denim and a crisp shirt in the city' },
  { id: 'ig-4', image: unsplash('1529139574466-a303027c1d8b'), alt: 'Bold red tee with statement sunglasses' },
  { id: 'ig-5', image: unsplash('1531891437562-4301cf35b7e4'), alt: 'Cap and black tee portrait' },
  { id: 'ig-6', image: unsplash('1588117305388-c2631a279f82'), alt: 'Relaxed fit with sneakers on the steps' },
]

export const FAQS = [
  {
    group: 'Products & Condition',
    items: [
      {
        q: 'What does “Pre-Loved” mean?',
        a: 'Pre-Loved items have been owned and worn before. We source them, inspect every seam, clean them and grade them before listing. Each pre-loved product page shows its grade and specific condition notes, so you know exactly what you are getting.',
      },
      {
        q: 'How do your condition grades work?',
        a: 'Excellent: minimal or no signs of wear. Very Good: light wear such as gentle fading or minor pilling. Good: visible wear that is described in detail and reflected in the price. We never list items with undisclosed damage.',
      },
      {
        q: 'Are the “New” items actually new?',
        a: 'Yes. Items marked New are unworn — either from our own essentials line or deadstock with tags. They are never pre-owned.',
      },
      {
        q: 'Why is there only one of some items?',
        a: 'Most pre-loved pieces are one-of-one. Once it is gone, it is gone — which is why we suggest adding to cart quickly if you love something.',
      },
      {
        q: 'How do I find my size?',
        a: 'Pre-loved items list the tagged size plus actual measurements taken flat. Compare those with a piece you already own that fits well — it is the most reliable way to size vintage and thrifted clothes.',
      },
    ],
  },
  {
    group: 'Orders & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'UPI, credit and debit cards, net banking and Cash on Delivery on eligible pincodes.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'You can cancel within 2 hours of placing your order by emailing us with your order number. After it has been packed, we cannot change it.',
      },
      {
        q: 'Do you restock items?',
        a: 'Our New essentials are restocked regularly. Pre-loved items are unique and do not get restocked, but we add fresh drops every Friday.',
      },
    ],
  },
  {
    group: 'Shipping & Returns',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Orders are dispatched within 1–2 business days. Standard delivery takes 3–7 business days depending on your location; Express takes 2–4.',
      },
      {
        q: 'Can I return a pre-loved item?',
        a: 'Pre-loved items can be returned if they are significantly not as described. Raise a request within 48 hours of delivery with photos. See our Return & Refund Policy for details.',
      },
      {
        q: 'What is your return window for new items?',
        a: 'New items can be returned unworn, unwashed and with tags attached within 7 days of delivery.',
      },
    ],
  },
]

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
]

export const HERO_IMAGE = unsplash('1520975954732-35dd22299614')
export const EDITORIAL_IMAGE = unsplash('1529139574466-a303027c1d8b')
export const EDITORIAL_IMAGE_ALT = unsplash('1548126032-079a0fb0099d')
export const ABOUT_IMAGE = unsplash('1567401893414-76b7b1e5a7a5')
export const ABOUT_IMAGE_ALT = unsplash('1523381210434-271e8be1f52b')
