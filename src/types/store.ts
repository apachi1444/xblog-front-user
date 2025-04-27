import type { Article } from "./article"

export interface Store {
  id: string
  name: string
  url: string
  logo: string
  isConnected: boolean
  articlesCount: number
  lastUpdated: string
  performance: {
    visitors: number
    sales: number
    revenue: number
  }
  articles_list: Article[],
  platform?: string
  business?: string
  creationDate?: string
}
  
  