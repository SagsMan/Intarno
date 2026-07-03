import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'

export default function CartPage() {
  const { items, count, subtotal, removeItem, updateQty, clearCart } = useCart()

  if (count === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto mb-6 text-intarno-light" strokeWidth={1} />
        <h1 className="font-display text-3xl md:text-4xl text-intarno-black mb-3">Your cart is empty</h1>
        <p className="text-intarno-mid mb-8">Explore our curated collections and add pieces you love.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-intarno-black text-intarno-white text-sm tracking-widest uppercase hover:bg-intarno-accent transition-colors">
          Shop Furniture <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-xs text-intarno-mid">
        <Link to="/" className="hover:text-intarno-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-intarno-black">Cart</span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl text-intarno-black mb-10">
        Shopping Cart <span className="text-intarno-mid text-xl font-normal">({count} {count === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="flex gap-5 border-b border-intarno-cream pb-6">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover bg-intarno-cream"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-display text-lg text-intarno-black hover:text-intarno-accent transition-colors">
                      {item.name}
                    </Link>
                    {item.category && (
                      <p className="text-xs text-intarno-mid mt-0.5 capitalize">{item.category}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-intarno-light hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-intarno-light">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-intarno-mid hover:text-intarno-black transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium border-x border-intarno-light min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-intarno-mid hover:text-intarno-black transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="font-medium text-intarno-black">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-intarno-mid hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-intarno-cream p-6 md:p-8 sticky top-24">
            <h2 className="font-display text-xl text-intarno-black mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-intarno-mid">
                <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                <span>{formatPrice(subtotal, '₦')}</span>
              </div>
              <div className="flex justify-between text-intarno-mid">
                <span>Delivery</span>
                <span className="text-intarno-black">To be confirmed</span>
              </div>
              <div className="border-t border-intarno-cream pt-3 flex justify-between font-medium text-intarno-black">
                <span>Estimated Total</span>
                <span>{formatPrice(subtotal, '₦')}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-intarno-black text-intarno-white text-sm tracking-widest uppercase hover:bg-intarno-accent transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <p className="mt-4 text-xs text-intarno-mid text-center">
              Prefer to speak with us first?{' '}
              <Link to="/contact" className="underline hover:text-intarno-accent">Request a quote</Link>
            </p>

            <div className="mt-6 pt-6 border-t border-intarno-cream">
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 text-sm text-intarno-mid hover:text-intarno-black transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
