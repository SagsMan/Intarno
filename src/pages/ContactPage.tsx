import { useState, useEffect } from 'react'
  import { MapPin, Phone, Mail, Clock, CheckCircle2, Package, MessageCircle } from 'lucide-react'
  import { supabase } from '../lib/supabase'

  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2348000000000'
  const WHATSAPP_MSG = encodeURIComponent(
    "Hello Intarno, I'd like to enquire about your luxury furniture and interior design services in Abuja."
  )

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
          name: form.name, email: form.email,
          phone: form.phone || null, message: form.message || null, service: form.service,
        })
      } catch {}
      finally { setSubmitting(false); setSubmitted(true) }
    }

    const handleSamplesSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (selectedSwatches.length === 0) return
      setSamplesSubmitting(true)
      try {
        await supabase.from('sample_requests').insert({
          name: samplesForm.name, email: samplesForm.email,
          address: samplesForm.address || null, city: samplesForm.city || null,
          postcode: samplesForm.postcode || null, swatches: selectedSwatches,
        })
      } catch {}
      finally { setSamplesSubmitting(false); setSamplesSubmitted(true) }
    }

    const toggleSwatch = (id: string) => {
      setSelectedSwatches(prev =>
        prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 5 ? [...prev, id] : prev
      )
    }

    const filteredSwatches = swatchFilter === 'All' ? swatches : swatches.filter(s => s.category === swatchFilter)

    return (
      <div>
        <div className="relative h-56 md:h-64 overflow-hidden bg-intarno-charcoal">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=60"
            alt="Intarno luxury furniture showroom Abuja interior design consultation"
            className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <h1 className="font-display text-5xl md:text-6xl text-white font-light">Get in touch</h1>
            <p className="text-white/60 text-sm tracking-wide">Abuja's premier luxury furniture & interior design studio</p>
          </div>
        </div>

        <div className="border-b border-intarno-cream" id="samples">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex gap-0">
              {[{ key: 'consultation', label: 'Interior Design Service' }, { key: 'samples', label: 'Order Free Samples' }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-6 py-4 text-sm font-medium tracking-wide border-b-2 transition-all ${activeTab === tab.key ? 'border-intarno-black text-intarno-black' : 'border-transparent text-intarno-mid hover:text-intarno-black'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-14">
          {activeTab === 'consultation' && (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="eyebrow text-intarno-mid mb-3">No obligation</p>
                <h2 className="font-display text-3xl font-light mb-6">Let us help you transform your space</h2>
                <p className="text-intarno-mid text-sm leading-relaxed mb-8">
                  Our expert designers in Abuja are ready to help. Fill in the form and we will arrange a no-obligation consultation at a time that suits you.
                </p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 mb-8 text-sm font-medium hover:bg-[#1ebe5d] transition-colors w-full justify-center">
                  <MessageCircle size={18} />
                  Chat with us on WhatsApp — instant reply
                </a>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 h-px bg-intarno-cream" />
                  <span className="text-xs text-intarno-light tracking-wider uppercase">or send us a message</span>
                  <div className="flex-1 h-px bg-intarno-cream" />
                </div>
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
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                      </div>
                      <div>
                        <label className="eyebrow block mb-1.5">Email *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="eyebrow block mb-1.5">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+234 8xx xxx xxxx"
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-1.5">How can we help?</label>
                      <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors appearance-none bg-white">
                        <option value="consultation">Interior Design Consultation</option>
                        <option value="room-planning">Room Planning</option>
                        <option value="delivery">Delivery & Assembly (Abuja)</option>
                        <option value="warranty">Warranty Claim</option>
                        <option value="other">Other Enquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="eyebrow block mb-1.5">Message</label>
                      <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors resize-none"
                        placeholder="Tell us about your project — we serve Maitama, Wuse, Asokoro, Gwarinpa & all of Abuja FCT..." />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                      {submitting ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-intarno-cream p-8">
                  <h3 className="font-display text-xl font-light mb-6">Our Abuja Showroom</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-intarno-accent mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm text-intarno-mid block">14 Bangui Street, Maitama District</span>
                        <span className="text-sm text-intarno-mid block">Abuja, FCT 900271, Nigeria</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-intarno-accent mt-0.5 shrink-0" />
                      <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-sm text-intarno-mid hover:text-intarno-black transition-colors">
                        +{WHATSAPP_NUMBER}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-intarno-accent mt-0.5 shrink-0" />
                      <a href="mailto:hello@intarno.com" className="text-sm text-intarno-mid hover:text-intarno-black transition-colors">
                        hello@intarno.com
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-intarno-accent mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm text-intarno-mid block">Mon – Sat: 9am – 6pm</span>
                        <span className="text-sm text-intarno-mid block">Sunday: Closed</span>
                      </div>
                    </div>
                  </div>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer"
                    className="mt-6 flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp us for instant response
                  </a>
                </div>

                <div className="overflow-hidden border border-intarno-cream">
                  <iframe
                    title="Intarno Showroom — Maitama, Abuja"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=7.4724%2C9.0771%2C7.5124%2C9.0971&layer=mapnik&marker=9.0871%2C7.4924"
                    width="100%"
                    height="300"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                  />
                  <a href="https://www.google.com/maps/search/Maitama+District+Abuja+Nigeria/@9.0871,7.4924,15z"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-intarno-cream py-2.5 text-xs text-intarno-mid hover:text-intarno-black transition-colors font-medium tracking-wide">
                    <MapPin size={12} />
                    Open in Google Maps
                  </a>
                </div>

                <div className="border border-intarno-cream p-6">
                  <h4 className="font-medium text-sm mb-3">Serving all of Abuja FCT</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Maitama', 'Wuse 2', 'Asokoro', 'Gwarinpa', 'Jabi', 'Garki', 'Utako', 'Lifecamp'].map(area => (
                      <span key={area} className="text-xs px-2.5 py-1 bg-intarno-cream text-intarno-mid">{area}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">Free services included</h4>
                  {['Interior Design Consultation', 'Fabric & Material Samples', 'Room Planning', 'Home Delivery & Assembly (Abuja)'].map(service => (
                    <div key={service} className="flex items-center gap-2 text-sm text-intarno-mid py-1">
                      <div className="w-1 h-1 rounded-full bg-intarno-accent shrink-0" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="eyebrow text-intarno-mid mb-3">Completely free</p>
                <h2 className="font-display text-3xl font-light mb-3">Order your free fabric samples</h2>
                <p className="text-intarno-mid text-sm leading-relaxed mb-8">
                  Choose up to 5 swatches and we will ship them directly to your door in Abuja — completely free, no obligation.
                </p>
                {samplesSubmitted ? (
                  <div className="bg-intarno-cream p-10 text-center">
                    <Package size={36} className="text-intarno-accent mx-auto mb-4" />
                    <p className="font-display text-2xl font-light mb-2">Samples on their way!</p>
                    <p className="text-intarno-mid text-sm mb-1">Your {selectedSwatches.length} sample{selectedSwatches.length !== 1 ? 's' : ''} will arrive within 3–5 business days.</p>
                    <p className="text-intarno-mid text-xs">A confirmation has been sent to {samplesForm.email}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSamplesSubmit} className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="eyebrow text-intarno-black">Select swatches <span className="ml-2 text-intarno-mid font-normal normal-case text-xs tracking-normal">({selectedSwatches.length}/5)</span></p>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {categories.map(cat => (
                            <button key={cat} type="button" onClick={() => setSwatchFilter(cat)}
                              className={`text-[11px] px-2.5 py-1 border transition-colors ${swatchFilter === cat ? 'border-intarno-black bg-intarno-black text-white' : 'border-intarno-light text-intarno-mid hover:border-intarno-black'}`}>
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
                            <button key={swatch.id} type="button" disabled={maxed} onClick={() => toggleSwatch(swatch.id)}
                              title={swatch.name} className={`group flex flex-col items-center gap-1.5 ${maxed ? 'opacity-30 cursor-not-allowed' : ''}`}>
                              <div className={`w-full aspect-square rounded-sm border-2 transition-all ${chosen ? 'border-intarno-black scale-105 shadow-md' : 'border-transparent hover:border-intarno-light'}`}
                                style={{ backgroundColor: swatch.color }}>
                                {chosen && <div className="w-full h-full flex items-center justify-center"><CheckCircle2 size={16} className="text-white drop-shadow" /></div>}
                              </div>
                              <span className={`text-[10px] text-center leading-tight ${chosen ? 'text-intarno-black font-medium' : 'text-intarno-mid'}`}>{swatch.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="eyebrow text-intarno-black">Delivery details</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="eyebrow block mb-1.5">Full Name *</label>
                          <input type="text" required value={samplesForm.name} onChange={e => setSamplesForm({ ...samplesForm, name: e.target.value })}
                            className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                        </div>
                        <div>
                          <label className="eyebrow block mb-1.5">Email *</label>
                          <input type="email" required value={samplesForm.email} onChange={e => setSamplesForm({ ...samplesForm, email: e.target.value })}
                            className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="eyebrow block mb-1.5">Delivery Address *</label>
                        <input type="text" required value={samplesForm.address} onChange={e => setSamplesForm({ ...samplesForm, address: e.target.value })}
                          placeholder="Street address, Abuja"
                          className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="eyebrow block mb-1.5">City / Area *</label>
                          <input type="text" required value={samplesForm.city} onChange={e => setSamplesForm({ ...samplesForm, city: e.target.value })}
                            placeholder="e.g. Maitama, Wuse 2"
                            className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                        </div>
                        <div>
                          <label className="eyebrow block mb-1.5">Postcode</label>
                          <input type="text" value={samplesForm.postcode} onChange={e => setSamplesForm({ ...samplesForm, postcode: e.target.value })}
                            className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors" />
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={selectedSwatches.length === 0 || samplesSubmitting}
                      className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
                      {samplesSubmitting ? 'Sending…' : selectedSwatches.length === 0 ? 'Choose at least one swatch' : `Send me ${selectedSwatches.length} free sample${selectedSwatches.length !== 1 ? 's' : ''}`}
                    </button>
                  </form>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-intarno-cream p-8">
                  <h3 className="font-display text-xl font-light mb-5">Why order samples?</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'See the colour in your space', body: "Colours shift under Abuja's light. A sample in your home is the only way to know for sure." },
                      { title: 'Feel the quality', body: 'Every fabric is crafted to last. Samples let you appreciate weight, texture and finish before committing.' },
                      { title: 'Compare options side by side', body: 'Order up to 5 swatches and lay them out to find the perfect combination.' },
                      { title: 'Completely free delivery', body: 'Shipped to your Abuja address at no cost. No subscription, no catch.' },
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
                  <p className="text-intarno-mid text-xs leading-relaxed mb-4">Our Abuja designers can recommend the perfect materials for your project.</p>
                  <button type="button" onClick={() => setActiveTab('consultation')}
                    className="text-xs font-medium tracking-wider uppercase border-b border-intarno-black pb-0.5 hover:border-intarno-accent hover:text-intarno-accent transition-all">
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
  