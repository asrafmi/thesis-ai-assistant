'use server'

import { serverApiClient } from '@/lib/axios.server'

interface UniversityResult {
  name: string
  short_name: string
  university_type: string
  province: string
}

interface ApiResponse {
  is_success: boolean
  data: UniversityResult[]
}

export async function searchUniversitiesAction(query: string): Promise<UniversityResult[]> {
  if (!query.trim()) return []

  try {
    const { data: json } = await serverApiClient.get<ApiResponse>(
      'https://use.api.co.id/regional/indonesia/universities',
      {
        params: { page: 1, name: query },
        headers: {
          accept: 'application/json',
          'x-api-co-id': process.env.UNIVERSITY_API_KEY!,
        },
      },
    )

    if (!json.is_success) return []
    return json.data
  } catch {
    return []
  }
}
