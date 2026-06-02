import { useState } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const items = (
    <>
      <Link to="/shop/outlet" className="hover:text-intarno-accent transition-colors duration-200 shrink-0">
        ✦ SALE — Final days to save on selected pieces
      </Link>
      <span className="text-intarno-light shrink-0">|</span>
      <Link to="/contact" className="hover:text-intarno-accent transition-colors duration-200 shrink-0">
        Free delivery on orders over ₦500,000
      </Link>
      <span className="text-intarno-light shrink-0">|</span>
      <Link to="/contact#samples" className="hover:text-intarno-accent transition-colors duration-200 shrink-0">
        Order free fabric samples
      </Link>
      <span className="text-intarno-light shrink-0">|</span>
    </>
  )

  return (
    <div className="bg-intarno-black text-intarno-white text-xs tracking-widest uppercase py-2.5 relative overflow-hidden">
      <div className="flex items-center gap-8 whitespace-nowrap animate-marquee-slow pr-8">
        {items}
        {/* Duplicate for seamless loop */}
        {items}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-intarno-light transition-colors z-10 bg-intarno-black pl-2"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}
