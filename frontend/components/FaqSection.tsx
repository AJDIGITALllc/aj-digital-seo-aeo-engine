/**
 * FaqSection — renders FAQ pairs as accessible HTML.
 *
 * Renders a <dl> list of question/answer pairs using semantic HTML.
 * Does NOT inject JSON-LD — that's handled by SchemaScript in the page
 * (avoids duplicate structured data when schemaPackJson is also present).
 *
 * If you need the FAQ section to own its own JSON-LD (e.g. for service pages
 * that don't have schemaPackJson), set injectJsonLd={true}.
 */

import type { FaqPair } from '@/lib/sanity/types'

interface FaqSectionProps {
  pairs: FaqPair[]
  heading?: string
  injectJsonLd?: boolean  // set true only when SchemaScript is not present
  className?: string
}

export default function FaqSection({
  pairs,
  heading = 'Frequently Asked Questions',
  injectJsonLd = false,
  className,
}: FaqSectionProps) {
  if (!pairs || pairs.length === 0) return null

  const jsonLd = injectJsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pairs.map((pair) => ({
          '@type': 'Question',
          name: pair.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: pair.answer,
          },
        })),
      }
    : null

  return (
    <section className={className ?? 'faq-section'} aria-labelledby="faq-heading">
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <h2 id="faq-heading">{heading}</h2>

      <dl>
        {pairs.map((pair, index) => (
          <div key={index} className="faq-item">
            <dt className="faq-question">{pair.question}</dt>
            <dd className="faq-answer">{pair.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
