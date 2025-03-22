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
  articles_list: {
    id: string
    title: string
    description: string
    publishedDate: string
    readTime: string
    views: number
  }[],
  platform?: string
  business?: string
  creationDate?: string
}

  export interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    publishDate: string
    readTime: number
    views: number
    author: string
    category: string
    tags: string[]
    imageUrl: string
    seoScore: number
    keywordDensity: number
    backlinks: number
}
  
  