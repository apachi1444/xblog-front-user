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
  articles_list?: Article[]
  business?: string
  // Legacy fields for backward compatibility
  isConnected?: boolean
  platform?: string
  creationDate?: string
}
  
  