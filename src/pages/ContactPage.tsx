import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', service: 'consultation' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-intarno-charcoal">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=60"
          alt="Interior design consultation"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-5xl md:text-6xl text-white font-light">Get in touch</h1>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div>
            <p className="eyebrow text-intarno-mid mb-3">Interior Design Service</p>
            <h2 className="font-display text-3xl font-light mb-6">Let us help you transform your space</h2>
            <p className="text-intarno-mid text-sm leading-relaxed mb-8">
              Our expert designers are ready to help. Fill in the form and we'll arrange a no-obligation consultation at a time that suits you.
            </p>

            {submitted ? (
              <div className="bg-intarno-cream p-8 text-center">
                <p className="font-display text-2xl font-light mb-3">Thank you!</p>
                <p className="text-intarno-mid">We'll be in touch within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="eyebrow block mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="eyebrow block mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="eyebrow block mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
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
                    <option value="samples">Order Fabric Samples</option>
                    <option value="delivery">Delivery & Assembly</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="other">Other Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="eyebrow block mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-intarno-light px-3 py-2.5 text-sm focus:outline-none focus:border-intarno-black transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send message
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

            {/* Map placeholder */}
            <div className="h-48 bg-intarno-cream flex items-center justify-center text-intarno-light border border-intarno-cream">
              <MapPin size={24} />
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm">Free services</h4>
              {[
                'Interior Design Consultation',
                'Fabric & Material Samples',
                'Room Planning',
                'Home Delivery & Assembly',
              ].map(service => (
                <div key={service} className="flex items-center gap-2 text-sm text-intarno-mid">
                  <div className="w-1 h-1 rounded-full bg-intarno-accent" />
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
