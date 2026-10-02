import type { Filters, SearchResponse } from './types';

// За замовчуванням — через проксі Vite (/freeserp). Для статичного хостингу задайте
// VITE_API_BASE=https://freeserp.ai у .env, тоді запити підуть напряму.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/freeserp';
const API = `${BASE}/api.php`;
export const PAGE_SIZE = 12;

// Нішеві категорії, які FreeSerp враховує як справжні AI-стартапи (ai_startups=1)
export const CATEGORIES = [
  'AI Agents & Autonomous', 'Code & Dev Tools', 'AI Infrastructure & API',
  'AI Automation & Workflows', 'LLM & Prompt Tools', 'AI Search & Answers',
  'AI Website Builder', 'No-code / App Builder', 'Image Generation',
  'Video Generation', 'Voice & Text-to-Speech', 'Data & Analytics',
  'Research & Science', 'Design & UI', 'AI Chatbot & Assistant',
];

export async function fetchSites(f: Filters, from: number, signal: AbortSignal): Promise<SearchResponse> {
  const p = new URLSearchParams({
    index: 'sites',
    ai_startups: '1',
    size: String(PAGE_SIZE),
    from: String(from),
    agent: 'AI-Explorer/1.0',
    project: 'AI Explorer',
  });
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.category) p.set('ai_categories', f.category);
  if (f.drMin > 0) p.set('dr_min', String(f.drMin));
  const [sort, order] = f.sort.split(':');
  p.set('sort', sort);
  if (sort !== 'relevance') p.set('order', order);

  let res: Response;
  try {
    res = await fetch(`${API}?${p.toString()}`, { signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw new Error("Браузер не зміг з'єднатися з API (мережа, CORS або блокувальник реклами)");
  }
  if (!res.ok) throw new Error(`Сервер відповів зі статусом ${res.status}`);
  let data: SearchResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error('API повернув відповідь не у форматі JSON');
  }
  if (!data.ok) throw new Error(data.error || 'API повернув помилку');
  return data;
}
