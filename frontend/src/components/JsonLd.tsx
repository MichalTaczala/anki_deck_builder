export default function JsonLd() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MemoHill",
      "url": "https://memohill.com",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MemoHill",
      "url": "https://memohill.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://memohill.com/favicon/web-app-manifest-192x192.png",
        "width": 192,
        "height": 192
      }

    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MemoHill",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://memohill.com",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]
      },
      "description": "AI-powered language learning flashcards compatible with Anki and other flashcard applications.",

      "author": {
        "@type": "Organization",
        "name": "MemoHill",
        "url": "https://memohill.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://memohill.com/favicon/web-app-manifest-192x192.png",
          "width": 192,
          "height": 192
        }
      },
      "featureList": [
        "AI-powered Anki flashcard generation for language learning",
        "Different levels of difficulty support",
        "Anki compatibility",
        "Multiple language support",
        "Spaced repetition learning",
        "Customizable learning paths"
      ],
      "softwareVersion": "1.0.0",
      "applicationSubCategory": "Language Learning",
      "permissions": "none",
      "releaseNotes": "Initial release with AI-powered flashcard generation",
    }
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
