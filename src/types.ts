export interface Site {
  domain: string;
  url: string;
  title?: string | null;
  ai_summary?: string | null;
  ai_categories?: string[] | string | null;
  dr?: number | null;
  went_live?: string | null;
}

export interface SearchResponse {
  ok: boolean;
  total: number;
  count: number;
  results: Site[];
  error?: string;
}

export interface Filters {
  q: string;
  category: string;
  drMin: number;
  sort: string; // "field:order"
}
