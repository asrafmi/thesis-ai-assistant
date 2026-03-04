// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import { tavily } from '@tavily/core'

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
}

export async function searchAcademicPapers(query: string): Promise<TavilySearchResult[]> {
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY })

  const response = await client.search(query, {
    searchDepth: 'basic',
    maxResults: 5,
    includeDomains: [
      'scholar.google.com',
      'researchgate.net',
      'sciencedirect.com',
      'jstor.org',
      'pubmed.ncbi.nlm.nih.gov',
      'semanticscholar.org',
      'arxiv.org',
      'springer.com',
      'tandfonline.com',
      'wiley.com',
      'journals.sagepub.com',
    ],
  })

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }))
}
