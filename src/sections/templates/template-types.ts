export interface ArticleTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  popular: boolean;
  isNew: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  structure: {
    sections: {
      title: string;
      description?: string;
    }[];
    seoTips: string[];
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}