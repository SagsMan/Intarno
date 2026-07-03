import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, ChevronDown, Ruler, Package, X, CheckCircle } from 'lucide-react'
import { products } from '../data/products'
import { formatPrice } from '../utils/format'
import ProductCard from '../components/ui/ProductCard'
import { useWishlist } from '../contexts/WishlistContext'
import { supabase } from '../lib/supabase'

const SERVICES = [
  { value: 'consultation', label: 'Design Consultation' },
  { value: 'custom_furniture', label: 'Custom Furniture' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'project_management', label: 'Project Management' },
]

export default function ProductPage() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)

  const [activeImage, setActiveImage] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [expandedSection, setExpandedSection] = useState<string | null>('description')

  // Quote modal state
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [quoteSending, setQuoteSending] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [quoteForm, setQuoteForm] = useState({
    name: '', email: '', phone: '', message: '', service: 'consultation'
  })

  // Wishlist
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = product ? isWishlisted(product.id) : false

  if (!product) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Product not found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const accordionSections = [
    {
      id: 'description',
      title: 'Description',
      content: product.description,
    },
    {
      id: 'dimensions',
      title: 'Dimensions',
      content: product.dimensions
        ? `Width: ${product.dimensions.width}cm × Height: ${product.dimensions.height}cm × Depth: ${product.dimensions.depth}cm`
        : 'Contact us for dimensions',
    },
    {
      id: 'materials',
      title: 'Materials & Care',
      content: product.materials?.join(' · ') ?? 'Premium materials, sustainably sourced. Wipe clean with a dry cloth.',
    },
    {
      id: 'delivery',
      title: 'Delivery & Assembly',
      content: 'Free delivery on orders over ₦500,000. White-glove delivery and professional assembly available. Typically 4–8 weeks for custom orders.',
    },
  ]

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteForm.name.trim() || !quoteForm.email.trim()) return
    setQuoteSending(true)
    setQuoteError(null)
    try {
      const { error } = await supabase.from('inquiries').insert({
        name: quoteForm.name.trim(),
        email: quoteForm.email.trim(),
        phone: quoteForm.phone.trim() || null,
        service: quoteForm.service,
        message: `Quote request for: ${product.name}\n\n${quoteForm.message.trim()}`,
      })
      if (error) throw error
      setQuoteSent(true)
    } catch (err) {
      console.error('[Quote] submit error:', err)
      setQuoteError('Failed to send your request. Please try again or contact us directly.')
    } finally {
      setQuoteSending(false)
    }
  }

  const closeQuote = () => {
    setQuoteOpen(false)
    setTimeout(() => {
      setQuoteSent(false)
      setQuoteError(null)
      setQuoteForm({ name: '', email: '', phone: '', message: '', service: 'consultation' })
    }, 300)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch {
      // user cancelled share
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 py-4 text-xs text-intarno-mid">
        <Link to="/" className="hover:text-intarno-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-intarno-black transition-colors">Furniture</Link>
        <span>/</span>
        <Link to={`/shop/${product.category}`} className="hover:text-intarno-black transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-intarno-black">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 py-4 md:py-8">
        {/* Images */}
        <div>
          {/* Main image */}
          <div className="aspect-[4/5] overflow-hidden bg-intarno-cream mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-intarno-black' : 'border-transparent hover:border-intarno-light'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:pt-4">
          {/* Badges */}
          <div className="flex gap-2 mb-3">
            {product.isNew && (
              <span className="bg-intarno-black text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">New</span>
            )}
            {product.isSale && (
              <span className="bg-red-600 text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">Sale</span>
            )}
          </div>

          {product.collection && (
            <p className="eyebrow text-intarno-mid mb-2">{product.collection}</p>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {product.isSale && product.salePrice ? (
              <>
                <span className="text-xl font-medium text-red-600">{formatPrice(product.salePrice, product.currency)}</span>
                <span className="text-intarno-light line-through">{formatPrice(product.price, product.currency)}</span>
              </>
            ) : (
              <span className="text-xl font-medium">{formatPrice(product.price, product.currency)}</span>
            )}
          </div>

          {/* Color selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium tracking-wide mb-3">
                Material / Colour — <span className="text-intarno-mid">Option {activeColor + 1}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      activeColor === i ? 'border-intarno-black scale-110' : 'border-white hover:border-intarno-light shadow-sm'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setQuoteOpen(true)}
              className="btn-primary flex-1"
            >
              Request a Quote
            </button>
            <button
              onClick={() => toggle(product)}
              className={`btn-secondary flex items-center justify-center gap-2 sm:w-auto transition-colors ${wishlisted ? 'text-red-500' : ''}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
              <span className="sm:hidden">{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center justify-center gap-2 sm:w-auto"
            >
              <Share2 size={16} />
              <span className="sm:hidden">Share</span>
            </button>
          </div>

          {/* Service links */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link to="/contact#samples" className="flex items-center gap-2 text-xs font-medium text-intarno-mid hover:text-intarno-black transition-colors">
              <Package size={14} />
              Order free samples
            </Link>
            <Link to="/contact" className="flex items-center gap-2 text-xs font-medium text-intarno-mid hover:text-intarno-black transition-colors">
              <Ruler size={14} />
              Book a consultation
            </Link>
          </div>

          {/* Accordion */}
          <div className="border-t border-intarno-cream">
            {accordionSections.map(section => (
              <div key={section.id} className="border-b border-intarno-cream">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium text-sm tracking-wide">{section.title}</span>
                  <ChevronDown
                    size={16}
                    className={`text-intarno-mid transition-transform duration-200 ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSection === section.id && (
                  <div className="pb-4 animate-fade-in">
                    <p className="text-sm text-intarno-mid leading-relaxed">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="py-16 border-t border-intarno-cream">
          <h2 className="font-display text-3xl font-light mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {quoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeQuote}
        >
          <div
            className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <div>
                <h2 className="font-display text-2xl text-intarno-black">Request a Quote</h2>
                <p className="text-xs text-intarno-mid mt-0.5">{product.name}</p>
              </div>
              <button onClick={closeQuote} className="text-intarno-mid hover:text-intarno-black">
                <X size={20} />
              </button>
            </div>

            {quoteSent ? (
              <div className="px-8 py-12 text-center">
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-intarno-black mb-2">Request Sent</h3>
                <p className="text-sm text-intarno-mid leading-relaxed">
                  Thank you! Our team will get back to you within 24–48 hours with a personalised quote.
                </p>
                <button
                  onClick={closeQuote}
                  className="mt-6 px-8 py-3 bg-intarno-charcoal text-white text-sm tracking-wider hover:bg-intarno-accent transition-colors rounded-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="px-8 py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Full Name *</label>
                    <input
                      required
                      value={quoteForm.name}
                      onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      value={quoteForm.email}
                      onChange={e => setQuoteForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+234 …"
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Service Type</label>
                    <select
                      value={quoteForm.service}
                      onChange={e => setQuoteForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white"
                    >
                      {SERVICES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Additional Notes</label>
                    <textarea
                      value={quoteForm.message}
                      onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Dimensions, quantity, customisation requirements…"
                      rows={4}
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none"
                    />
                  </div>
                </div>

                {quoteError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                    {quoteError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeQuote}
                    className="flex-1 py-3 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSending}
                    className="flex-1 py-3 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50"
                  >
                    {quoteSending ? 'Sending…' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
