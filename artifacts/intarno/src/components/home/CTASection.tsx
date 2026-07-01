import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, LifeBuoy, Users } from 'lucide-react'

const ctas = [
  {
    Icon: MessageCircle,
    title: 'Chat with our Interior Designers',
    description: 'Speak directly with one of our experts to bring your vision to life with personalised advice and creative solutions.',
    href: '/contact',
    cta: 'Book a consultation',
  },
  {
    Icon: MapPin,
    title: 'Find a store near you',
    description: 'Come and get a feel for our products, discuss your living space, and see how to achieve your desired look.',
    href: '/contact#stores',
    cta: 'Find my local store',
  },
  {
    Icon: LifeBuoy,
    title: 'Customer services',
    description: 'Detailed information about assembly, delivery, sampling, warranties, and a variety of other helpful services.',
    href: '/contact',
    cta: 'Visit customer services',
  },
  {
    Icon: Users,
    title: 'Looking for a career?',
    description: 'We\'re always looking for dynamic and skilled employees who are passionate about design and exceptional service.',
    href: '/about#careers',
    cta: 'Join our team',
  },
]

export default function CTASection() {
  return (
    <section className="bg-intarno-cream/60 py-16 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="eyebrow text-intarno-mid mb-3">We're here to help</p>
          <h2 className="section-title">Let us help you,<br className="md:hidden" /> <span className="italic">no obligations</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ctas.map(({ Icon, title, description, href, cta }) => (
            <div key={title} className="bg-intarno-white p-6 md:p-8 flex flex-col">
              <div className="w-10 h-10 flex items-center justify-center bg-intarno-cream mb-5">
                <Icon size={20} className="text-intarno-charcoal" />
              </div>
              <h3 className="font-display text-lg font-medium mb-3">{title}</h3>
              <p className="text-intarno-mid text-sm leading-relaxed flex-1 mb-5">{description}</p>
              <Link to={href} className="btn-ghost text-intarno-black text-xs">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
