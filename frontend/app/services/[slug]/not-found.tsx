import Link from 'next/link'

export default function ServiceNotFound() {
  return (
    <main>
      <h1>Service page not found</h1>
      <p>This service may have been renamed, removed, or the URL may be incorrect.</p>
      <Link href="/services">← View all services</Link>
    </main>
  )
}
