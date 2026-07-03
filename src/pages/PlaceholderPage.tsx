import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl sm:text-4xl font-light mb-4">{title}</h1>
        <p className="text-intarno-mid mb-8">
          {description ?? 'This page is coming soon. Check back shortly.'}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/contact" className="btn-secondary">Contact us</Link>
        </div>
      </div>
    </div>
  )
}
