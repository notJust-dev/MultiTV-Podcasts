import {createHttpClient, HttpClient} from './httpClient';
import {
  PODCAST_INDEX_API_KEY,
  PODCAST_INDEX_API_SECRET,
  PODCAST_INDEX_BASE_URL,
  PODCAST_INDEX_USER_AGENT,
} from '../config';
import type {Episode, Feed} from '../types';

export type DigestSHA1 = (input: string) => Promise<string>;

export interface PodcastIndexClientConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  userAgent?: string;
  digestSHA1: DigestSHA1;
}

interface ApiResponse {
  status: string | boolean;
  query?: unknown;
  description?: string;
}

interface TrendingResponse extends ApiResponse {
  feeds: Feed[];
  count: number;
}

interface FeedByIdResponse extends ApiResponse {
  feed: Feed;
}

interface EpisodesResponse extends ApiResponse {
  items: Episode[];
  count: number;
}

interface EpisodeByIdResponse extends ApiResponse {
  episode: Episode;
}

interface SearchResponse extends ApiResponse {
  feeds: Feed[];
  count: number;
}

export class PodcastIndexClient {
  private http: HttpClient;
  private apiKey: string;
  private apiSecret: string;
  private userAgent: string;
  private digestSHA1: DigestSHA1;

  constructor(config: PodcastIndexClientConfig) {
    this.apiKey = config.apiKey ?? PODCAST_INDEX_API_KEY;
    this.apiSecret = config.apiSecret ?? PODCAST_INDEX_API_SECRET;
    this.userAgent = config.userAgent ?? PODCAST_INDEX_USER_AGENT;
    this.digestSHA1 = config.digestSHA1;
    this.http = createHttpClient({
      baseUrl: config.baseUrl ?? PODCAST_INDEX_BASE_URL,
    });
  }

  private async buildAuthHeaders(): Promise<Record<string, string>> {
    const authDate = Math.floor(Date.now() / 1000).toString();
    const authorization = await this.digestSHA1(
      this.apiKey + this.apiSecret + authDate,
    );
    return {
      'User-Agent': this.userAgent,
      'X-Auth-Date': authDate,
      'X-Auth-Key': this.apiKey,
      Authorization: authorization,
    };
  }

  private async get<T>(
    path: string,
    query?: Record<string, unknown>,
  ): Promise<T> {
    const headers = await this.buildAuthHeaders();
    const res = await this.http.get<T>(path, query, headers);
    if (!res.ok) {
      throw new Error(
        `PodcastIndex request failed (${res.status}) for ${path}`,
      );
    }
    return res.data;
  }

  async fetchTrending(max = 20): Promise<Feed[]> {
    const data = await this.get<TrendingResponse>('/podcasts/trending', {max});
    return data.feeds ?? [];
  }

  async fetchFeedById(id: string | number): Promise<Feed | null> {
    const data = await this.get<FeedByIdResponse>('/podcasts/byfeedid', {id});
    return data.feed ?? null;
  }

  async fetchEpisodesByFeedId(
    id: string | number,
    max = 30,
  ): Promise<Episode[]> {
    const data = await this.get<EpisodesResponse>('/episodes/byfeedid', {
      id,
      max,
    });
    return data.items ?? [];
  }

  async fetchEpisodeById(id: string | number): Promise<Episode | null> {
    const data = await this.get<EpisodeByIdResponse>('/episodes/byid', {id});
    return data.episode ?? null;
  }

  async searchPodcasts(term: string, max = 20): Promise<Feed[]> {
    const data = await this.get<SearchResponse>('/search/byterm', {
      q: term,
      max,
    });
    return data.feeds ?? [];
  }
}

export function createPodcastIndexClient(
  config: PodcastIndexClientConfig,
): PodcastIndexClient {
  return new PodcastIndexClient(config);
}
