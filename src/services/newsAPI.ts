import axios from 'axios';
import { NewsResponse, SearchFilters } from '../types/news';

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

// Enhanced mock data with more variety
const MOCK_ARTICLES = [
  {
    title: "Revolutionary AI Breakthrough: GPT-5 Announced with Unprecedented Capabilities",
    description: "OpenAI unveils GPT-5 with groundbreaking multimodal capabilities, promising to revolutionize how we interact with artificial intelligence across industries.",
    content: "This groundbreaking development in artificial intelligence represents a significant leap forward in machine learning capabilities, featuring advanced reasoning and creative problem-solving abilities...",
    url: "https://example.com/ai-breakthrough-gpt5",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: { name: "AI Today", url: "https://aitoday.com" }
  },
  {
    title: "Web Development Revolution: New React 19 Features Transform Frontend Development",
    description: "React 19 introduces game-changing features including automatic batching, concurrent rendering improvements, and enhanced developer experience tools.",
    content: "The latest React release brings significant performance improvements and developer experience enhancements that will reshape how we build modern web applications...",
    url: "https://example.com/react-19-features",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { name: "Dev Weekly", url: "https://devweekly.com" }
  },
  {
    title: "Cybersecurity Alert: New Zero-Day Vulnerability Affects Millions of Devices",
    description: "Security researchers discover critical vulnerability in widely-used networking equipment, prompting urgent patches from major manufacturers.",
    content: "A newly discovered zero-day vulnerability has been found to affect millions of networking devices worldwide, raising serious concerns about infrastructure security...",
    url: "https://example.com/cybersecurity-zero-day",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: { name: "Security Today", url: "https://securitytoday.com" }
  },
  {
    title: "Blockchain Innovation: Ethereum 2.0 Upgrade Reduces Energy Consumption by 99%",
    description: "The completed Ethereum merge to proof-of-stake consensus mechanism delivers on promises of dramatically reduced environmental impact while maintaining security.",
    content: "Ethereum's transition to proof-of-stake represents one of the most significant upgrades in blockchain history, addressing long-standing environmental concerns...",
    url: "https://example.com/ethereum-energy-reduction",
    image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: { name: "Crypto News", url: "https://cryptonews.com" }
  },
  {
    title: "Mobile Development Breakthrough: Flutter 4.0 Introduces Desktop-First Design",
    description: "Google's Flutter framework expands beyond mobile with comprehensive desktop support, unified codebase, and native performance across all platforms.",
    content: "Flutter 4.0 marks a significant milestone in cross-platform development, offering developers a truly unified solution for mobile, web, and desktop applications...",
    url: "https://example.com/flutter-4-desktop",
    image: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: { name: "Mobile Dev", url: "https://mobiledev.com" }
  },
  {
    title: "Cloud Computing Evolution: AWS Announces Quantum Computing Service for Enterprises",
    description: "Amazon Web Services launches quantum computing platform, making quantum algorithms accessible to businesses through cloud infrastructure.",
    content: "AWS's new quantum computing service democratizes access to quantum algorithms, potentially accelerating breakthroughs in optimization, cryptography, and machine learning...",
    url: "https://example.com/aws-quantum-computing",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { name: "Cloud Weekly", url: "https://cloudweekly.com" }
  },
  {
    title: "Startup Success: AI-Powered Healthcare Platform Raises $100M Series B",
    description: "Revolutionary healthcare AI startup secures major funding to expand personalized medicine platform across global markets.",
    content: "The funding round highlights growing investor confidence in AI-driven healthcare solutions that promise to transform patient care and medical diagnostics...",
    url: "https://example.com/healthcare-ai-funding",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    source: { name: "Startup News", url: "https://startupnews.com" }
  },
  {
    title: "Tech Hardware Innovation: Apple's M4 Chip Delivers 40% Performance Boost",
    description: "Apple's latest silicon breakthrough promises unprecedented performance and efficiency gains for next-generation MacBooks and iPads.",
    content: "The M4 chip represents Apple's continued push toward custom silicon dominance, featuring advanced neural processing units and industry-leading power efficiency...",
    url: "https://example.com/apple-m4-chip",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { name: "Tech Review", url: "https://techreview.com" }
  }
];

// Create axios instance with better error handling
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', {
      url: config.url,
      params: config.params,
      method: config.method
    });
    
    // Add timestamp to prevent caching
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

// Enhanced response interceptor
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
      message: error.message,
      code: error.code
    });

    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Using cached content.');
      } else if (error.response?.status === 401) {
        throw new Error('API key invalid. Using offline content.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Using cached content.');
      } else if (error.response?.status >= 500) {
        throw new Error('News service temporarily unavailable. Using offline content.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Using cached content.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Using offline content.');
      }
    }
    throw new Error('Using offline content due to connectivity issues.');
  }
);

class NewsAPI {
  private async fetchFromGNews(endpoint: string, params: Record<string, string>) {
    // Always check API key first
    if (!GNEWS_API_KEY || GNEWS_API_KEY === 'your_gnews_api_key_here') {
      console.warn('⚠️ GNews API key not configured, using enhanced mock data');
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
      console.error('🔥 GNews API Error, falling back to enhanced mock data:', error);
      return this.getMockData();
    }
  }

  private getMockData() {
    console.log('📰 Using enhanced mock data with', MOCK_ARTICLES.length, 'articles');
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
    
    console.log('📰 Processed search articles:', {
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
      'ai': 'artificial intelligence OR machine learning OR AI OR ML OR deep learning OR neural networks OR ChatGPT OR OpenAI OR Claude OR Gemini',
      'webdev': 'web development OR frontend OR backend OR javascript OR react OR nodejs OR vue OR angular OR typescript OR CSS OR HTML',
      'mobile': 'mobile development OR iOS OR Android OR React Native OR Flutter OR Swift OR Kotlin OR mobile apps OR smartphone',
      'cybersecurity': 'cybersecurity OR security OR hacking OR privacy OR data breach OR malware OR encryption OR ransomware OR firewall',
      'cloud': 'cloud computing OR AWS OR Azure OR Google Cloud OR serverless OR kubernetes OR docker OR microservices OR DevOps',
      'blockchain': 'blockchain OR cryptocurrency OR bitcoin OR ethereum OR web3 OR NFT OR DeFi OR crypto OR smart contracts OR metaverse',
      'startup': 'startup OR venture capital OR funding OR IPO OR tech companies OR unicorn OR Series A OR entrepreneurship OR innovation',
      'gadgets': 'gadgets OR hardware OR smartphone OR laptop OR tech reviews OR Apple OR Samsung OR Google OR electronics OR wearables'
    };

    const query = categoryQueries[category] || 'technology OR tech OR programming OR software OR innovation OR digital';
    
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
        console.log('❌ Invalid article filtered out:', article?.title || 'Unknown');
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
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return null;
    }
    
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
      .substring(0, 300);
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