export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MemoHill',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '9.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://memohill.com',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    description: 'AI-powered language learning flashcards compatible with Anki and other flashcard applications.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'MemoHill',
      url: 'https://memohill.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://memohill.com/logo.png'
      }
    },
    featureList: [
      'AI-powered flashcard generation',
      'Anki compatibility',
      'Multiple language support',
      'Spaced repetition learning',
      'Customizable learning paths'
    ],
    screenshot: {
      '@type': 'ImageObject',
      url: 'https://memohill.com/screenshot.png'
    },
    softwareVersion: '1.0.0',
    applicationSubCategory: 'Language Learning',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    permissions: 'none',
    releaseNotes: 'Initial release with AI-powered flashcard generation',
    softwareHelp: 'https://memohill.com/help',
    termsOfService: 'https://memohill.com/terms',
    privacyPolicy: 'https://memohill.com/privacy'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 