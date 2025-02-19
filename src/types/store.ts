export interface Store {
  id: string
  name: string
  url: string
  logo: string
  articlesCount: number
  lastUpdated: string
  isConnected: boolean // New field
  performance: {
    visitors: number
    sales: number
    revenue: number
  }
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
  
  