import { SHIPPING, SITE } from './site'

/**
 * Policy copy. This is a sensible starting draft for a small Indian online store —
 * have it reviewed before launch.
 */
export const POLICIES = {
  shipping: {
    path: '/shipping',
    title: 'Shipping & Delivery',
    description: 'Dispatch times, delivery estimates and shipping charges for GULLY RACK orders across India.',
    updated: '2026-11-01',
    intro: 'We ship across India from our studio. Here’s exactly what to expect after you place an order.',
    sections: [
      {
        heading: 'Dispatch',
        body: [
          'Orders are packed and dispatched within 1–2 business days (Monday to Saturday, excluding public holidays).',
          'Orders placed after 2:00 PM IST on Saturday, or on Sunday, are dispatched from Monday.',
        ],
      },
      {
        heading: 'Delivery times & charges',
        table: {
          head: ['Method', 'Delivery time', 'Charge'],
          rows: [
            ['Standard', '3–7 business days', `₹${SHIPPING.standardFee} · Free above ₹${SHIPPING.freeThreshold}`],
            ['Express', '2–4 business days', `₹${SHIPPING.expressFee}`],
            ['Cash on Delivery', 'Same as chosen method', 'No extra charge'],
          ],
        },
        body: ['Delivery times are estimates and may be longer for remote pincodes or during sale periods and festivals.'],
      },
      {
        heading: 'Tracking',
        body: [
          'Once your order ships, you’ll receive a tracking link by email and SMS / WhatsApp on the number you provided at checkout.',
        ],
      },
      {
        heading: 'Failed deliveries',
        body: [
          'Our courier partners make up to three delivery attempts. If an order is returned to us undelivered, we’ll contact you to arrange re-shipping (additional charges may apply) or a refund of the product value for prepaid orders.',
        ],
      },
      {
        heading: 'Damaged or tampered parcels',
        body: [
          'If your parcel looks damaged or tampered with, please refuse delivery or record an unboxing video and contact us within 48 hours.',
        ],
      },
    ],
  },
  returns: {
    path: '/returns',
    title: 'Return & Refund Policy',
    description: 'How returns, exchanges and refunds work for new and pre-loved items at GULLY RACK.',
    updated: '2026-11-01',
    intro:
      'We want you to love what you buy. Because pre-loved pieces are unique, the rules differ slightly between New and Pre-Loved items.',
    sections: [
      {
        heading: 'New items',
        body: [
          'New items can be returned within 7 days of delivery.',
          'Items must be unworn, unwashed and in original condition with all tags attached.',
          'Size exchanges are available for New items subject to stock.',
        ],
      },
      {
        heading: 'Pre-loved items',
        body: [
          'Every pre-loved item is graded and described in detail, including measurements, so most pre-loved sales are final.',
          'If a pre-loved item is significantly not as described — for example, an undisclosed stain, tear or a wrong size — you can raise a return within 48 hours of delivery with clear photos.',
          'Pre-loved items cannot be returned for fit or change of mind, so please check measurements before ordering.',
        ],
      },
      {
        heading: 'Non-returnable items',
        body: ['Accessories worn on the face or head (sunglasses, caps, beanies) for hygiene reasons, unless faulty.', 'Items bought on final sale.'],
      },
      {
        heading: 'How to start a return',
        body: [
          `Email ${SITE.email} with your order number, the item(s) and the reason. Add photos for pre-loved claims.`,
          'We’ll confirm eligibility and arrange a reverse pickup where available, or share a return address.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'Refunds are processed within 5–7 business days of the returned item passing quality check.',
          'Prepaid orders are refunded to the original payment method. Cash on Delivery orders are refunded via bank transfer or UPI.',
          'Original shipping charges are non-refundable unless the item was faulty or not as described.',
        ],
      },
    ],
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'How GULLY RACK collects, uses and protects your personal information.',
    updated: '2026-11-01',
    intro: 'Your privacy matters to us. This policy explains what we collect, why, and the choices you have.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'Details you give us: name, email, phone number and delivery address when you place an order, contact us or subscribe to our newsletter.',
          'Order information: items purchased, order value and payment method (we never store full card details — payments are handled by our payment partner).',
          'Device and usage data: browser type, pages viewed and similar analytics, collected through cookies.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To process and deliver orders, and to send order and shipping updates.',
          'To respond to your questions and support requests.',
          'To send drop alerts and offers if you’ve subscribed — you can unsubscribe at any time.',
          'To improve our website and prevent fraud.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share only what is needed with service providers who help us run the store — courier partners, payment processors and email tools. We never sell your personal data.',
        ],
      },
      {
        heading: 'Cart & wishlist storage',
        body: [
          'Your bag and wishlist are saved in your browser’s local storage so they persist between visits on the same device. Clearing your browser data removes them.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          `You can ask to access, correct or delete your personal data at any time by emailing ${SITE.email}.`,
        ],
      },
    ],
  },
  terms: {
    path: '/terms',
    title: 'Terms & Conditions',
    description: 'The terms that apply when you browse or buy from GULLY RACK.',
    updated: '2026-11-01',
    intro: `These terms apply to your use of ${SITE.url.replace('https://', '')} and any purchase you make from GULLY RACK.`,
    sections: [
      {
        heading: 'Products & condition',
        body: [
          'Items are sold either as New or Pre-Loved, as clearly labelled on every product page.',
          'Pre-loved items have been previously owned and may show signs of wear consistent with their stated grade. We describe visible flaws as accurately as we can; minor variations may exist.',
          'Colours may appear slightly different depending on your screen.',
        ],
      },
      {
        heading: 'Pricing & availability',
        body: [
          'All prices are in Indian Rupees (INR) and include applicable taxes.',
          'Most pre-loved items are one-of-one. Adding an item to your bag does not reserve it; availability is confirmed only once your order is placed.',
          'If an item becomes unavailable after you order, we’ll notify you and issue a full refund for that item.',
        ],
      },
      {
        heading: 'Orders',
        body: [
          'We reserve the right to cancel orders in cases of pricing errors, suspected fraud or stock issues. You’ll be fully refunded in such cases.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The GULLY RACK name, logo, photography and website content belong to GULLY RACK and may not be used without permission.',
        ],
      },
      {
        heading: 'Governing law',
        body: ['These terms are governed by the laws of India.'],
      },
      {
        heading: 'Contact',
        body: [`Questions about these terms? Email ${SITE.email}.`],
      },
    ],
  },
}
