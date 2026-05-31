import { useState } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-intarno-black text-intarno-white text-xs tracking-widest uppercase py-2.5 px-4 flex items-center justify-center gap-4 relative">
      <div className="animate-marquee-slow flex items-center gap-8 whitespace-nowrap">
        <Link to="/shop/outlet" className="hover:text-intarno-accent transition-colors duration-200">
          ✦ SALE — Final days to save on selected pieces
        </Link>
        <span className="text-intarno-light">|</span>
        <Link to="/contact" className="hover:text-intarno-accent transition-colors duration-200">
          Free delivery on orders over ₦500,000
        </Link>
        <span className="text-intarno-light">|</span>
        <Link to="/contact#samples" className="hover:text-intarno-accent transition-colors duration-200">
          Order free fabric samples
        </Link>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-intarno-light transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}
