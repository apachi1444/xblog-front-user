export interface ContentPerformanceData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface SEOScoreData {
  label: string;
  value: number;
}

export interface KeywordPerformance {
  keyword: string;
  score: number;
  articles: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ArticleTypeData {
  label: string;
  value: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  type: 'generation' | 'optimization' | 'publication' | 'update';
  time: string;
}

export interface WebsiteMetric {
  label: string;
  value: string;
}