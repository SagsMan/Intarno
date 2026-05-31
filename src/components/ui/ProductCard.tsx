import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Product, formatPrice } from '../../data/products'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [wishlist, setWishlist] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="group relative">
      {/* Image container */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-intarno-cream aspect-[3/4] relative">
        {!imgLoaded && <div className="absolute inset-0 bg-intarno-cream animate-pulse" />}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Hover second image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-intarno-black text-intarno-white text-[10px] font-medium tracking-widest uppercase px-2 py-1">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-intarno-red text-white text-[10px] font-medium tracking-widest uppercase px-2 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Heart
            size={15}
            className={wishlist ? 'fill-red-500 text-red-500' : 'text-intarno-charcoal'}
          />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-intarno-black text-white text-xs font-medium tracking-widest uppercase py-3 hover:bg-intarno-charcoal transition-colors">
            Quick View
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 px-0.5">
        {product.collection && (
          <p className="eyebrow text-intarno-light mb-0.5 text-[10px]">{product.collection}</p>
        )}
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display text-lg font-light leading-tight hover:text-intarno-accent transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {product.isSale && product.salePrice ? (
            <>
              <span className="font-medium text-intarno-red text-sm">
                {formatPrice(product.salePrice, product.currency)}
              </span>
              <span className="text-intarno-light text-sm line-through">
                {formatPrice(product.price, product.currency)}
              </span>
            </>
          ) : (
            <span className="font-medium text-sm">
              {formatPrice(product.price, product.currency)}
            </span>
          )}
        </div>
        {/* Color swatches */}
        {product.colors && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 5).map((color) => (
              <button
                key={color}
                className="w-4 h-4 rounded-full border border-intarno-light/40 hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-intarno-light">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
