import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'

// Home is bundled eagerly for the fastest first paint; everything else is code-split.
const Shop = lazy(() => import('../pages/Shop'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Cart = lazy(() => import('../pages/Cart'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const Faqs = lazy(() => import('../pages/Faqs'))
const PolicyPage = lazy(() => import('../pages/PolicyPage'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmed" element={<OrderConfirmation />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="shipping" element={<PolicyPage policy="shipping" />} />
        <Route path="returns" element={<PolicyPage policy="returns" />} />
        <Route path="privacy-policy" element={<PolicyPage policy="privacy" />} />
        <Route path="terms" element={<PolicyPage policy="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
