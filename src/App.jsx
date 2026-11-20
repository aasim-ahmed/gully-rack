import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'sonner'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { UIProvider } from './context/UIContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    // reducedMotion="user": every Framer animation honours the OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <UIProvider>
          <WishlistProvider>
            <CartProvider>
              <AppRoutes />
              <Toaster
                position="bottom-right"
                offset={20}
                mobileOffset={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))', left: 12, right: 12 }}
                toastOptions={{
                  classNames: {
                    toast: 'rounded-none! border-0! bg-ink! font-sans! text-white! shadow-2xl!',
                    title: 'text-[11px]! font-bold! uppercase! tracking-[0.16em]!',
                    description: 'text-xs! text-white/60!',
                    actionButton:
                      'rounded-none! bg-blue! text-[10px]! font-semibold! uppercase! tracking-[0.16em]! text-white! h-8! px-3!',
                    cancelButton: 'rounded-none!',
                    success: '[&_[data-icon]]:text-blue!',
                    error: '[&_[data-icon]]:text-danger!',
                  },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </UIProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
