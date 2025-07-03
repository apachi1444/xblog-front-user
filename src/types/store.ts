import type { Article } from "./article"

export interface Store {
  id: number
  name: string
  url?: string
  logo?: string
  avatar?: string
  is_active: boolean
  category: string
  created_at: string
  articlesCount?: number
  lastUpdated?: string
  performance?: {
    visitors: number
    sales: number
    revenue: number
  }
  articles_list?: Article[]
  business?: string
  // Legacy fields for backward compatibility
  isConnected?: boolean
  platform?: string
  creationDate?: string
}
  
  