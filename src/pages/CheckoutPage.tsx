import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils/format'

const EMPTY_FORM = {
  name: '', email: '', phone: '', address: '', city: '', country: 'Nigeria', notes: ''
}

function generateOrderNumber() {
  return 'ORD-' + Date.now().toString().slice(-8)
}

export default function CheckoutPage() {
  const { items, subtotal, count, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (count === 0 && !submitted) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto mb-6 text-intarno-light" strokeWidth={1} />
        <h1 className="font-display text-3xl text-intarno-black mb-3">Your cart is empty</h1>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-intarno-black text-intarno-white text-sm tracking-widest uppercase hover:bg-intarno-accent transition-colors">
          Shop Furniture
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-24 text-center">
        <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-500" strokeWidth={1} />
        <h1 className="font-display text-3xl md:text-4xl text-intarno-black mb-3">Order Received</h1>
        <p className="text-intarno-mid mb-2">Thank you for your order, {form.name.split(' ')[0]}!</p>
        <p className="text-sm text-intarno-mid mb-8">
          Order reference: <span className="font-medium text-intarno-black">{orderNumber}</span><br />
          We'll be in touch within 24–48 hours to confirm your order and arrange delivery.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="px-8 py-3 bg-intarno-black text-intarno-white text-sm tracking-widest uppercase hover:bg-intarno-accent transition-colors">
            Back to Home
          </Link>
          <Link to="/shop" className="px-8 py-3 border border-intarno-light text-intarno-mid text-sm tracking-widest uppercase hover:border-intarno-black hover:text-intarno-black transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    setError(null)

    const orderNum = generateOrderNumber()

    try {
      // Upsert customer
      const { data: customer } = await supabase
        .from('customers')
        .upsert({ name: form.name, email: form.email, phone: form.phone || null, address: form.address || null, city: form.city || null, country: form.country }, { onConflict: 'email', ignoreDuplicates: false })
        .select()
        .single()

      // Create order
      await supabase.from('orders').insert({
        order_number: orderNum,
        customer_id: customer?.id ?? null,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
        subtotal,
        total: subtotal,
        currency: '₦',
        status: 'pending',
        notes: form.notes || null,
        delivery_address: [form.address, form.city, form.country].filter(Boolean).join(', ') || null,
      })

      setOrderNumber(orderNum)
      clearCart()
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', required = false, placeholder = '') => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-transparent"
      />
    </div>
  )

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-xs text-intarno-mid">
        <Link to="/" className="hover:text-intarno-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-intarno-black transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-intarno-black">Checkout</span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl text-intarno-black mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-display text-xl text-intarno-black mb-4">Delivery Information</h2>

          {field('Full Name', 'name', 'text', true, 'Your full name')}

          <div className="grid grid-cols-2 gap-4">
            {field('Email Address', 'email', 'email', true, 'your@email.com')}
            {field('Phone Number', 'phone', 'tel', false, '+234 …')}
          </div>

          {field('Delivery Address', 'address', 'text', false, 'Street address')}

          <div className="grid grid-cols-2 gap-4">
            {field('City', 'city', 'text', false, 'Abuja, Lagos…')}
            <div>
              <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Country</label>
              <select
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-transparent"
              >
                <option>Nigeria</option>
                <option>Ghana</option>
                <option>Kenya</option>
                <option>South Africa</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Order Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Special instructions, customisation requirements, preferred delivery time…"
              rows={3}
              className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-transparent resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
          )}

          <p className="text-xs text-intarno-mid leading-relaxed">
            By placing your order, our team will contact you to confirm availability, delivery timeline, and payment details. 
            We accept bank transfer, card payment, and payment on delivery (Lagos & Abuja).
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-intarno-black text-intarno-white text-sm tracking-widest uppercase hover:bg-intarno-accent transition-colors disabled:opacity-50"
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <h2 className="font-display text-xl text-intarno-black mb-4">Order Summary</h2>
          <div className="border border-intarno-cream p-6 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover bg-intarno-cream shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-intarno-black truncate">{item.name}</p>
                  <p className="text-xs text-intarno-mid">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-intarno-black whitespace-nowrap">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>
              </div>
            ))}

            <div className="border-t border-intarno-cream pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-intarno-mid">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, '₦')}</span>
              </div>
              <div className="flex justify-between text-intarno-mid">
                <span>Delivery</span>
                <span>TBC</span>
              </div>
              <div className="flex justify-between font-medium text-intarno-black text-base pt-2 border-t border-intarno-cream">
                <span>Total</span>
                <span>{formatPrice(subtotal, '₦')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
