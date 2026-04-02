import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <section className="container-shell pb-12 pt-6">
      <div className="glass-panel rounded-3xl p-8 md:p-12">
        <p className="mb-2 text-sm uppercase tracking-[0.28em]" style={{ color: 'var(--primary-soft)' }}>
          Premium E-Commerce
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
          Shop beautifully curated products with secure checkout.
        </h1>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: 'var(--text-muted)' }}>
          JoeMart helps customers discover products, manage carts, pay safely, and track orders in one simple experience powered by Django REST API.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/shop">Explore Shop</Link>
          <Link className="btn-secondary" to="/about">What is this app?</Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage
