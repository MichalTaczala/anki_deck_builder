import { MetadataRoute } from 'next'

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://memohill.com'
  
  // Core pages with detailed metadata
  const routes = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'daily' as ChangeFreq,
      lastModified: new Date(),
    },
    {
      path: '/privacy',
      priority: 0.5,
      changeFrequency: 'monthly' as ChangeFreq,
      lastModified: new Date(),
    },
    {
      path: '/terms',
      priority: 0.5,
      changeFrequency: 'monthly' as ChangeFreq,
      lastModified: new Date(),
    },
    {
      path: '/help',
      priority: 0.8,
      changeFrequency: 'weekly' as ChangeFreq,
      lastModified: new Date(),
    },
    {
      path: '/pricing',
      priority: 0.9,
      changeFrequency: 'weekly' as ChangeFreq,
      lastModified: new Date(),
    },
    {
      path: '/features',
      priority: 0.9,
      changeFrequency: 'weekly' as ChangeFreq,
      lastModified: new Date(),
    },
  ].map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  return routes
} 