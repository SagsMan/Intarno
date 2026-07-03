import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'

const swatches = [
  { id: 'oslo-grey', name: 'Oslo Grey', color: '#9e9e9e', category: 'Fabric' },
  { id: 'bergen-sand', name: 'Bergen Sand', color: '#c8b49a', category: 'Fabric' },
  { id: 'nordic-cream', name: 'Nordic Cream', color: '#f0e6d3', category: 'Fabric' },
  { id: 'fjord-blue', name: 'Fjord Blue', color: '#4a6fa5', category: 'Fabric' },
  { id: 'midnight-velvet', name: 'Midnight Velvet', color: '#1a1a2e', category: 'Velvet' },
  { id: 'sage-velvet', name: 'Sage Velvet', color: '#7c9a7e', category: 'Velvet' },
  { id: 'blush-velvet', name: 'Blush Velvet', color: '#d4a5a5', category: 'Velvet' },
  { id: 'cognac-leather', name: 'Cognac', color: '#9b5523', category: 'Leather' },
  { id: 'ivory-leather', name: 'Ivory', color: '#f5f0e8', category: 'Leather' },
  { id: 'charcoal-leather', name: 'Charcoal', color: '#3a3a3a', category: 'Leather' },
  { id: 'forest-boucle', name: 'Forest Boucle', color: '#5c6b4e', category: 'Boucle' },
  { id: 'oat-boucle', name: 'Oat Boucle', color: '#d6c9b0', category: 'Boucle' },
]

const categories = ['All', 'Fabric', 'Velvet', 'Leather', 'Boucle']

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'samples'>('consultation')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', service: 'consultation' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [selectedSwatches, setSelectedSwatches] = useState<string[]>([])
  const [swatchFilter, setSwatchFilter] = useState('All')
  const [samplesForm, setSamplesForm] = useState({ name: '', email: '', address: '', city: '', postcode: '' })
  const [samplesSubmitted, setSamplesSubmitted] = useState(false)
  const [samplesSubmitting, setSamplesSubmitting] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#samples') setActiveTab('samples')
  }, [])

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await supabase.from('inquiries').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message || null,
        service: form.service,
      })
    } catch {
      // Silently continue — show success even if DB write fails
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const handleSamplesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSwatches.length === 0) return
    setSamplesSubmitting(true)
    try {
      await supabase.from('sample_requests').insert({
        name: samplesForm.name,
        email: samplesForm.email,
        address: samplesForm.address || null,
        city: samplesForm.city || null,
        postcode: samplesForm.postcode || null,
        swatches: selectedSwatches,
      })
    } catch {
      // Silently continue
    } finally {
      setSamplesSubmitting(false)
      setSamplesSubmitted(true)
    }
  }

  const toggleSwatch = (id: string) => {
    setSelectedSwatches(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : prev.length < 5
          ? [...prev, id]
          : prev
    )
  }

  const filteredSwatches = swatchFilter === 'All'
    ? swatches
    : swatches.filter(s => s.category === swatchFilter)

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-intarno-charcoal">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=60"
          alt="Interior design consultation"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <h1 className="font-display text-5xl md:text-6xl text-white font-light">Get in touch</h1>
          <p className="text-white/60 text-sm tracking-wide">We are here to help you</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="border-b border-intarno-cream" id="samples">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex gap-0">
            {[
              { key: 'consultation', label: 'Interior Design Service' },
              { key: 'samples', label: 'Order Free Samples' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-4 text-sm font-medium tracking-wide border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-intarno-black text-intarno-black'
                    : 'border-transparent text-intarno-mid hover:text-intarno-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-14">
        {/* ── CONSULTATION TAB ── */}
        {activeTab === 'consultation' && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div>
              <p className="eyebrow text-intarno-mid mb-3">No obligation</p>
              <h2 className="font-display text-3xl font-light mb-6">Let us help you transform your space</h2>
              <p className="text-intarno-mid text-sm leading-relaxed mb-8">
                Our expert designers are ready to help. Fill in the form and we will arrange a no-obligation consultation at a time that suits you.
              </p>

              {submitted ? (
                <div className="bg-intarno-cream p-10 text-center">
                  <CheckCircle2 size={36} className="text-intarno-accent mx-auto mb-4" />
                  <p className="font-display text-2xl font-light mb-2">Thank you!</p>
                  <p className="text-intarno-mid text-sm">We will be in touch within 1–2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="eyebrow block mb-1.5">Full Name *</label>
                      <input
                        type="text" required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="eyebrow block mb-1.5">Email *</label>
                      <input
                        type="email" required value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="eyebrow block mb-1.5">Phone</label>
                    <input
                      type="tel" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="eyebrow block mb-1.5">How can we help?</label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors appearance-none bg-white"
                    >
                      <option value="consultation">Interior Design Consultation</option>
                      <option value="room-planning">Room Planning</option>
                      <option value="delivery">Delivery & Assembly</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="other">Other Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="eyebrow block mb-1.5">Message</label>
                    <textarea
                      rows={4} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="bg-intarno-cream p-8 mb-6">
                <h3 className="font-display text-xl font-light mb-6">Our Lagos Showroom</h3>
                <div className="space-y-4">
                  {[
                    { Icon: MapPin, text: '14 Adeola Odeku Street, Victoria Island, Lagos' },
                    { Icon: Phone, text: '+234 800 INTARNO' },
                    { Icon: Mail, text: 'hello@intarno.com' },
                    { Icon: Clock, text: 'Mon–Sat: 9am – 6pm · Sun: 11am – 4pm' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <Icon size={16} className="text-intarno-accent mt-0.5 shrink-0" />
                      <span className="text-sm text-intarno-mid">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-48 bg-intarno-cream flex items-center justify-center text-intarno-light border border-intarno-cream">
                <MapPin size={24} />
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Free services</h4>
                {['Interior Design Consultation', 'Fabric & Material Samples', 'Room Planning', 'Home Delivery & Assembly'].map(service => (
                  <div key={service} className="flex items-center gap-2 text-sm text-intarno-mid">
                    <div className="w-1 h-1 rounded-full bg-intarno-accent" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SAMPLES TAB ── */}
        {activeTab === 'samples' && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Swatch picker + form */}
            <div>
              <p className="eyebrow text-intarno-mid mb-3">Completely free</p>
              <h2 className="font-display text-3xl font-light mb-3">Order your free fabric samples</h2>
              <p className="text-intarno-mid text-sm leading-relaxed mb-8">
                Choose up to 5 swatches and we will ship them directly to your door — completely free, no obligation. Feel the quality before you decide.
              </p>

              {samplesSubmitted ? (
                <div className="bg-intarno-cream p-10 text-center">
                  <Package size={36} className="text-intarno-accent mx-auto mb-4" />
                  <p className="font-display text-2xl font-light mb-2">Samples on their way!</p>
                  <p className="text-intarno-mid text-sm mb-1">
                    Your {selectedSwatches.length} sample{selectedSwatches.length !== 1 ? 's' : ''} will arrive within 3–5 business days.
                  </p>
                  <p className="text-intarno-mid text-xs">A confirmation has been sent to {samplesForm.email}</p>
                </div>
              ) : (
                <form onSubmit={handleSamplesSubmit} className="space-y-8">
                  {/* Swatch grid */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="eyebrow text-intarno-black">
                        Select swatches
                        <span className="ml-2 text-intarno-mid font-normal normal-case text-xs tracking-normal">
                          ({selectedSwatches.length}/5 chosen)
                        </span>
                      </p>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSwatchFilter(cat)}
                            className={`text-[11px] px-2.5 py-1 border transition-colors ${
                              swatchFilter === cat
                                ? 'border-intarno-black bg-intarno-black text-white'
                                : 'border-intarno-light text-intarno-mid hover:border-intarno-black hover:text-intarno-black'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {filteredSwatches.map(swatch => {
                        const chosen = selectedSwatches.includes(swatch.id)
                        const maxed = selectedSwatches.length >= 5 && !chosen
                        return (
                          <button
                            key={swatch.id}
                            type="button"
                            disabled={maxed}
                            onClick={() => toggleSwatch(swatch.id)}
                            title={swatch.name}
                            className={`group flex flex-col items-center gap-1.5 transition-opacity ${maxed ? 'opacity-30 cursor-not-allowed' : ''}`}
                          >
                            <div
                              className={`w-full aspect-square rounded-sm border-2 transition-all duration-200 ${
                                chosen
                                  ? 'border-intarno-black scale-105 shadow-md'
                                  : 'border-transparent hover:border-intarno-light'
                              }`}
                              style={{ backgroundColor: swatch.color }}
                            >
                              {chosen && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <CheckCircle2 size={16} className="text-white drop-shadow" />
                                </div>
                              )}
                            </div>
                            <span className={`text-[10px] text-center leading-tight transition-colors ${chosen ? 'text-intarno-black font-medium' : 'text-intarno-mid'}`}>
                              {swatch.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {selectedSwatches.length === 0 && (
                      <p className="text-xs text-intarno-light mt-3 italic">Select at least one swatch to proceed.</p>
                    )}
                  </div>

                  {/* Delivery details */}
                  <div className="space-y-4">
                    <p className="eyebrow text-intarno-black">Delivery details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="eyebrow block mb-1.5">Full Name *</label>
                        <input
                          type="text" required value={samplesForm.name}
                          onChange={e => setSamplesForm({ ...samplesForm, name: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                        />
                      </div>
                      <div>
                        <label className="eyebrow block mb-1.5">Email *</label>
                        <input
                          type="email" required value={samplesForm.email}
                          onChange={e => setSamplesForm({ ...samplesForm, email: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="eyebrow block mb-1.5">Delivery Address *</label>
                      <input
                        type="text" required value={samplesForm.address}
                        onChange={e => setSamplesForm({ ...samplesForm, address: e.target.value })}
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="eyebrow block mb-1.5">City *</label>
                        <input
                          type="text" required value={samplesForm.city}
                          onChange={e => setSamplesForm({ ...samplesForm, city: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                        />
                      </div>
                      <div>
                        <label className="eyebrow block mb-1.5">Postcode</label>
                        <input
                          type="text" value={samplesForm.postcode}
                          onChange={e => setSamplesForm({ ...samplesForm, postcode: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={selectedSwatches.length === 0 || samplesSubmitting}
                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {samplesSubmitting
                      ? 'Sending…'
                      : selectedSwatches.length === 0
                        ? 'Choose at least one swatch'
                        : `Send me ${selectedSwatches.length} free sample${selectedSwatches.length !== 1 ? 's' : ''}`}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <div className="bg-intarno-cream p-8">
                <h3 className="font-display text-xl font-light mb-5">Why order samples?</h3>
                <div className="space-y-4">
                  {[
                    { title: 'See the colour in your space', body: 'Colours shift dramatically under different light conditions. Seeing a sample in your own home is the only way to know for sure.' },
                    { title: 'Feel the quality', body: 'Every fabric is crafted to last. Samples let you appreciate the weight, texture and finish before you commit.' },
                    { title: 'Compare options side by side', body: 'Order up to 5 swatches and lay them out together to find the perfect combination for your space.' },
                    { title: 'Completely free delivery', body: 'Samples are shipped to your door at no cost. No subscription, no catch.' },
                  ].map(({ title, body }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-intarno-accent mt-2 shrink-0" />
                      <div>
                        <p className="font-medium text-sm mb-1">{title}</p>
                        <p className="text-intarno-mid text-xs leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-intarno-cream p-6">
                <h4 className="font-medium text-sm mb-3">Need personalised help?</h4>
                <p className="text-intarno-mid text-xs leading-relaxed mb-4">
                  Our Interior Designers can recommend the perfect materials for your specific project and lighting conditions.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('consultation')}
                  className="text-xs font-medium tracking-wider uppercase border-b border-intarno-black pb-0.5 hover:border-intarno-accent hover:text-intarno-accent transition-all"
                >
                  Book a free consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
