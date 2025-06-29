export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'publishedAt' | 'relevance';
  from?: string;
  to?: string;
}

export const TECH_CATEGORIES = [
  { id: 'all', label: 'All Categories', query: 'technology OR tech OR AI OR programming OR software' },
  { id: 'ai', label: 'AI & Machine Learning', query: 'artificial intelligence OR machine learning OR AI OR ML OR deep learning' },
  { id: 'webdev', label: 'Web Development', query: 'web development OR frontend OR backend OR javascript OR react OR nodejs' },
  { id: 'mobile', label: 'Mobile Development', query: 'mobile development OR iOS OR Android OR React Native OR Flutter' },
  { id: 'cybersecurity', label: 'Cybersecurity', query: 'cybersecurity OR security OR hacking OR privacy OR data breach' },
  { id: 'cloud', label: 'Cloud Computing', query: 'cloud computing OR AWS OR Azure OR Google Cloud OR serverless' },
  { id: 'blockchain', label: 'Blockchain & Crypto', query: 'blockchain OR cryptocurrency OR bitcoin OR ethereum OR web3' },
  { id: 'startup', label: 'Startups & VC', query: 'startup OR venture capital OR funding OR IPO OR tech companies' },
  { id: 'gadgets', label: 'Gadgets & Hardware', query: 'gadgets OR hardware OR smartphone OR laptop OR tech reviews' }
] as const;