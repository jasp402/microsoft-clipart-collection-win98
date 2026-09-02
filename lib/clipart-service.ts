import { ClipartItem } from './types';
import { parseArchiveFilename, CURATED_ICONIC_CLIPS } from './curated-clips';
import { CATEGORIES } from './categories';

// In-memory cache for client-side Archive.org metadata
let cachedArchiveClips: ClipartItem[] | null = null;
let isArchiveFetchInProgress = false;

export async function fetchFullArchiveClips(): Promise<ClipartItem[]> {
  if (cachedArchiveClips && cachedArchiveClips.length > 0) {
    return cachedArchiveClips;
  }

  if (isArchiveFetchInProgress) {
    return CURATED_ICONIC_CLIPS;
  }

  try {
    isArchiveFetchInProgress = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('https://archive.org/metadata/MS_Clipart_Collection_SVG/files', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Archive response HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.result)) {
      const parsed: ClipartItem[] = [];
      const files = data.result;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && typeof file.name === 'string' && file.name.endsWith('.svg') && !file.name.startsWith('.')) {
          const item = parseArchiveFilename(file.name, parseInt(file.size, 10) || 12000);
          item.md5 = file.md5;
          parsed.push(item);
        }
      }

      if (parsed.length > 0) {
        cachedArchiveClips = parsed;
        isArchiveFetchInProgress = false;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Clip Gallery] Archive fetch fallback to curated set:', err);
  } finally {
    isArchiveFetchInProgress = false;
  }

  return CURATED_ICONIC_CLIPS;
}

export interface QueryClipsOptions {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  random?: boolean;
  sort?: 'default' | 'name' | 'size-asc' | 'size-desc';
}

export interface QueryClipsResult {
  items: ClipartItem[];
  total: number;
  page: number;
  totalPages: number;
  isArchiveFullReady: boolean;
}

export async function queryClipartItems(options: QueryClipsOptions): Promise<QueryClipsResult> {
  const {
    page = 1,
    limit = 48,
    category = 'all',
    q = '',
    random = false,
    sort = 'default',
  } = options;

  let pool: ClipartItem[] = cachedArchiveClips && cachedArchiveClips.length > 0
    ? cachedArchiveClips
    : CURATED_ICONIC_CLIPS;

  const isArchiveFullReady = pool.length > CURATED_ICONIC_CLIPS.length;

  // Filter by category
  if (category && category !== 'all') {
    const catObj = CATEGORIES.find(c => c.id === category);
    if (catObj) {
      const kw = catObj.queryKeywords || [];
      pool = pool.filter(item => {
        if (item.category === category) return true;
        return kw.some(k => item.title.toLowerCase().includes(k) || item.tags.some(t => t.includes(k)));
      });
    } else {
      pool = pool.filter(item => item.category === category);
    }
  }

  // Filter by search query
  if (q.trim()) {
    const tokens = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    pool = pool.filter(item => {
      const titleLower = item.title.toLowerCase();
      const tagsString = item.tags.join(' ').toLowerCase();
      const idLower = item.id.toLowerCase();
      return tokens.every(token => titleLower.includes(token) || tagsString.includes(token) || idLower.includes(token));
    });
  }

  // Sorting or Randomizing
  let results = [...pool];

  if (random) {
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }
  } else {
    switch (sort) {
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'size-asc':
        results.sort((a, b) => (a.size || 0) - (b.size || 0));
        break;
      case 'size-desc':
        results.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      default:
        break;
    }
  }

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    total,
    page: currentPage,
    totalPages,
    isArchiveFullReady,
  };
}
