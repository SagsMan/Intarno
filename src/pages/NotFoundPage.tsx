import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-light text-intarno-cream mb-6">404</p>
        <h1 className="font-display text-3xl font-light mb-4">Page not found</h1>
        <p className="text-intarno-mid mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/shop" className="btn-secondary">Shop furniture</Link>
        </div>
      </div>
    </div>
  )
}
