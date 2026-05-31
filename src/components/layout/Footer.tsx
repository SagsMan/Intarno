import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Pinterest, ArrowRight } from 'lucide-react'
import { footerLinks } from '../../data/navigation'

export default function Footer() {
  return (
    <footer className="bg-intarno-black text-intarno-white">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-intarno-light mb-2">Stay inspired</p>
              <h3 className="font-display text-2xl md:text-3xl font-light text-intarno-white">
                Join the Intarno community
              </h3>
            </div>
            <div className="flex w-full md:w-auto max-w-md gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-intarno-light focus:outline-none focus:border-intarno-accent transition-colors"
              />
              <button className="bg-intarno-accent hover:bg-intarno-accent-dark text-white px-5 py-3 flex items-center gap-2 text-sm font-medium tracking-wide transition-colors">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/">
              <img src="/logo.svg" alt="Intarno" className="h-8 w-auto mb-4 brightness-0 invert" />
            </Link>
            <p className="text-intarno-light text-sm leading-relaxed mb-6 max-w-xs">
              Contemporary furniture and interior design inspired by Scandinavian craft traditions.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Pinterest, href: '#', label: 'Pinterest' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-intarno-accent hover:text-intarno-accent transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-intarno-light mb-5">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-intarno-light hover:text-intarno-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-intarno-light mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-intarno-light hover:text-intarno-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-intarno-light mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-intarno-light hover:text-intarno-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-intarno-light text-xs">
            © {new Date().getFullYear()} Intarno. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs text-intarno-light hover:text-intarno-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
