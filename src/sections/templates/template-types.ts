export interface ArticleTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  popular: boolean;
  isNew: boolean;
  locked: boolean; // Add this property
  icon?: string;
  difficulty?: string;
  estimatedTime?: string;
  previewContent?: string;
  structure?: {
    sections: {
      title: string;
      description: string;
    }[];
    seoTips?: string[];
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}