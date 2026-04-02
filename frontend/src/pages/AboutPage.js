const AboutPage = () => {
  return (
    <section className="container-shell pb-12 pt-4">
      <article className="glass-panel rounded-2xl p-8 md:p-10">
        <h2 className="font-display text-3xl font-semibold">About</h2>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          This app is an online shop. People can create an account, sign in, look at products, add products to a cart, pay safely, and see their order history.
        </p>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          It is made for customers who want easy shopping and for businesses that want to sell products online. The backend uses Django REST API to keep data safe and organized.
        </p>
        <ul className="mt-5 list-disc space-y-2 pl-6 text-base" style={{ color: 'var(--text-muted)' }}>
          <li>Login and secure user accounts with JWT authentication</li>
          <li>Product catalog with details and images</li>
          <li>Shopping cart with quantity updates</li>
          <li>Checkout and Stripe payment flow</li>
          <li>Order history and tracking status</li>
        </ul>
      </article>
    </section>
  )
}

export default AboutPage
