import axios from 'axios';
import { NewsResponse, SearchFilters } from '../types/news';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

// Mock data for fallback when API is not available
const MOCK_ARTICLES = [
  {
    title: "Revolutionary AI Breakthrough Changes Everything",
    description: "Scientists have developed a new AI system that can understand and generate human-like responses with unprecedented accuracy.",
    content: "This groundbreaking development in artificial intelligence represents a significant leap forward in machine learning capabilities...",
    url: "https://example.com/ai-breakthrough",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { name: "Tech News", url: "https://technews.com" }
  },
  {
    title: "Web Development Trends for 2024",
    description: "Explore the latest trends in web development including new frameworks, tools, and best practices that are shaping the industry.",
    content: "The web development landscape continues to evolve rapidly with new technologies and methodologies...",
    url: "https://example.com/web-dev-trends",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: { name: "Dev Weekly", url: "https://devweekly.com" }
  },
  {
    title: "Cybersecurity Alert: New Threats Emerge",
    description: "Security experts warn of sophisticated new cyber attacks targeting businesses and individuals worldwide.",
    content: "Recent cybersecurity incidents have highlighted the need for enhanced protection measures...",
    url: "https://example.com/cybersecurity-alert",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { name: "Security Today", url: "https://securitytoday.com" }
  },
  {
    title: "Blockchain Technology Revolutionizes Finance",
    description: "Major financial institutions are adopting blockchain technology to improve transaction security and efficiency.",
    content: "The integration of blockchain technology in traditional finance is creating new opportunities...",
    url: "https://example.com/blockchain-finance",
    image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { name: "Crypto News", url: "https://cryptonews.com" }
  },
  {
    title: "Mobile App Development: Native vs Cross-Platform",
    description: "Developers debate the merits of native versus cross-platform development approaches for mobile applications.",
    content: "The choice between native and cross-platform development continues to be a key decision...",
    url: "https://example.com/mobile-dev-comparison",
    image: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: { name: "Mobile Dev", url: "https://mobiledev.com" }
  },
  {
    title: "Cloud Computing Costs Continue to Rise",
    description: "Businesses are looking for ways to optimize their cloud infrastructure spending as costs continue to increase.",
    content: "The growing reliance on cloud services has led to increased scrutiny of cloud computing costs...",
    url: "https://example.com/cloud-costs",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: { name: "Cloud Weekly", url: "https://cloudweekly.com" }
  }
];

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', {
      url: config.url,
      params: config.params,
      method: config.method
    });
    
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', {
      status: response.status,
      totalArticles: response.data?.totalArticles,
      articlesCount: response.data?.articles?.length
    });
    return response;
  },
  (error) => {
    console.error('❌ API response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your API permissions.');
      } else if (error.response?.status >= 500) {
        throw new Error('News service is temporarily unavailable. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    throw new Error('Failed to fetch news. Please try again later.');
  }
);

class NewsAPI {
  private async fetchFromGNews(endpoint: string, params: Record<string, string>) {
    // Check if API key is available
    if (!GNEWS_API_KEY) {
      console.warn('⚠️ GNews API key not configured, using mock data');
      return this.getMockData();
    }

    try {
      const response = await apiClient.get(endpoint, {
        params: {
          ...params,
          token: GNEWS_API_KEY,
        },
      });
      
      console.log('📊 Raw API response data:', response.data);
      
      if (!response.data || !Array.isArray(response.data.articles)) {
        console.error('❌ Invalid response format:', response.data);
        throw new Error('Invalid response format from news service');
      }
      
      return response.data;
    } catch (error) {
      console.error('🔥 GNews API Error, falling back to mock data:', error);
      return this.getMockData();
    }
  }

  private getMockData() {
    console.log('📰 Using mock data');
    return {
      totalArticles: MOCK_ARTICLES.length,
      articles: MOCK_ARTICLES
    };
  }

  async searchNews(filters: SearchFilters): Promise<NewsResponse> {
    console.log('🔍 Searching news with filters:', filters);
    
    const params: Record<string, string> = {
      q: filters.query.trim() || 'technology',
      sortby: filters.sortBy,
      lang: 'en',
      country: 'us',
      max: '50',
    };

    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    const data = await this.fetchFromGNews('/search', params);
    const processedArticles = this.processArticles(data.articles || []);
    
    console.log('📰 Processed articles:', {
      original: data.articles?.length || 0,
      processed: processedArticles.length
    });
    
    return {
      totalArticles: data.totalArticles || processedArticles.length,
      articles: processedArticles
    };
  }

  async getTopHeadlines(): Promise<NewsResponse> {
    console.log('📈 Fetching top headlines');
    
    const data = await this.fetchFromGNews('/top-headlines', {
      category: 'technology',
      lang: 'en',
      country: 'us',
      max: '50',
    });
    
    const processedArticles = this.processArticles(data.articles || []);
    
    console.log('🏆 Top headlines processed:', {
      original: data.articles?.length || 0,
      processed: processedArticles.length
    });
    
    return {
      totalArticles: data.totalArticles || processedArticles.length,
      articles: processedArticles
    };
  }

  async getNewsByCategory(category: string): Promise<NewsResponse> {
    console.log('🏷️ Fetching news by category:', category);
    
    const categoryQueries: Record<string, string> = {
      'ai': 'artificial intelligence OR machine learning OR AI OR ML OR deep learning OR neural networks OR ChatGPT OR OpenAI',
      'webdev': 'web development OR frontend OR backend OR javascript OR react OR nodejs OR vue OR angular OR typescript OR CSS',
      'mobile': 'mobile development OR iOS OR Android OR React Native OR Flutter OR Swift OR Kotlin OR mobile apps',
      'cybersecurity': 'cybersecurity OR security OR hacking OR privacy OR data breach OR malware OR encryption OR ransomware',
      'cloud': 'cloud computing OR AWS OR Azure OR Google Cloud OR serverless OR kubernetes OR docker OR microservices',
      'blockchain': 'blockchain OR cryptocurrency OR bitcoin OR ethereum OR web3 OR NFT OR DeFi OR crypto OR smart contracts',
      'startup': 'startup OR venture capital OR funding OR IPO OR tech companies OR unicorn OR Series A OR entrepreneurship',
      'gadgets': 'gadgets OR hardware OR smartphone OR laptop OR tech reviews OR Apple OR Samsung OR Google OR electronics'
    };

    const query = categoryQueries[category] || 'technology OR tech OR programming OR software OR innovation';
    
    return this.searchNews({
      query,
      category,
      sortBy: 'publishedAt'
    });
  }

  private processArticles(articles: any[]): any[] {
    console.log('⚙️ Processing articles:', {
      input: articles.length
    });

    const filteredArticles = articles.filter(article => {
      const isValid = article && 
        article.title && 
        article.description && 
        article.url &&
        article.source?.name &&
        article.publishedAt;
      
      if (!isValid) {
        console.log('❌ Invalid article filtered out:', article);
      }
      
      return isValid;
    });

    console.log('🔍 After filtering:', {
      filtered: filteredArticles.length,
      removed: articles.length - filteredArticles.length
    });

    const processedArticles = filteredArticles
      .map(article => ({
        ...article,
        image: this.validateImageUrl(article.image),
        description: this.cleanDescription(article.description),
        publishedAt: this.validateDate(article.publishedAt),
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    console.log('✅ Final processed articles:', {
      count: processedArticles.length
    });

    return processedArticles;
  }

  private validateImageUrl(imageUrl: string | null): string | null {
    if (!imageUrl) return null;
    
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return null;
    }
  }

  private cleanDescription(description: string): string {
    if (!description) return '';
    
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .trim()
      .substring(0, 200);
  }

  private validateDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return dateString;
    } catch {
      return new Date().toISOString();
    }
  }
}

export const newsAPI = new NewsAPI();