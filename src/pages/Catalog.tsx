import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIES, PAGE_SIZE, fetchSites } from '../api';
import { useDebounced } from '../hooks/useDebounced';
import SiteCard from '../components/SiteCard';
import type { Filters, Site } from '../types';

const SORTS = [
  { v: 'relevance:desc', l: 'За релевантністю' },
  { v: 'dr:desc', l: 'Domain Rating: від високого' },
  { v: 'dr:asc', l: 'Domain Rating: від низького' },
  { v: 'went_live:desc', l: 'Спершу найновіші' },
  { v: 'went_live:asc', l: 'Спершу найстаріші' },
];

type Status = 'loading' | 'ok' | 'error';

export default function Catalog() {
  const [filters, setFilters] = useState<Filters>({ q: '', category: '', drMin: 0, sort: 'relevance:desc' });
  const applied = useDebounced(filters, 400);
  const [items, setItems] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [more, setMore] = useState(false);
  const ctrl = useRef<AbortController | null>(null);

  const run = useCallback(async (f: Filters, from: number) => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    if (from === 0) setStatus('loading'); else setMore(true);
    try {
      const d = await fetchSites(f, from, c.signal);
      setItems((prev) => (from === 0 ? d.results : [...prev, ...d.results]));
      setTotal(d.total);
      setStatus('ok');
      setError('');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError((e as Error).message || 'Невідома помилка');
      setStatus('error');
    } finally {
      if (ctrl.current === c) setMore(false);
    }
  }, []);

  useEffect(() => { run(applied, 0); return () => ctrl.current?.abort(); }, [applied, run]);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters((f) => ({ ...f, [k]: v }));
  const reset = () => setFilters({ q: '', category: '', drMin: 0, sort: 'relevance:desc' });

  return (
    <>
      <section className="hero">
        <h1>AI Explorer</h1>
        <p>Каталог нових AI-сервісів: шукайте за темою, обирайте категорію й відсікайте сайти з низьким авторитетом.</p>
        <input
          className="search" type="search" placeholder="Наприклад, chatbot, voice, code assistant"
          aria-label="Пошук AI-сайтів" value={filters.q} onChange={(e) => set('q', e.target.value)}
        />
      </section>

      <section className="filters" aria-label="Фільтри">
        <label>Категорія
          <select value={filters.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Усі AI-категорії</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Мінімальний Domain Rating: <b>{filters.drMin}</b>
          <input type="range" min={0} max={80} step={5} value={filters.drMin}
            onChange={(e) => set('drMin', Number(e.target.value))} />
        </label>
        <label>Сортування
          <select value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </label>
      </section>

      <div className="status" role="status" aria-live="polite">
        {status === 'ok' && items.length > 0 && `Знайдено ${total.toLocaleString('uk-UA')} сайтів, показано ${items.length}`}
      </div>

      {status === 'loading' && (
        <div className="grid" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => <div className="card skeleton" key={i} />)}
        </div>
      )}

      {status === 'error' && (
        <div className="notice err" role="alert">
          <h3>Не вдалося завантажити дані</h3>
          <p>{error}. Перевірте інтернет-з'єднання й спробуйте ще раз.</p>
          <button className="btn" onClick={() => run(applied, 0)}>Повторити запит</button>
        </div>
      )}

      {status === 'ok' && items.length === 0 && (
        <div className="notice">
          <h3>Нічого не знайдено</h3>
          <p>Змініть запит, оберіть іншу категорію або зменшіть мінімальний Domain Rating.</p>
          <button className="btn" onClick={reset}>Скинути фільтри</button>
        </div>
      )}

      {status === 'ok' && items.length > 0 && (
        <>
          <div className="grid">{items.map((s, i) => <SiteCard key={s.domain} site={s} i={i % PAGE_SIZE} />)}</div>
          {items.length < total && (
            <button className="btn more" disabled={more} onClick={() => run(applied, items.length)}>
              {more ? 'Завантаження…' : 'Показати ще'}
            </button>
          )}
        </>
      )}
    </>
  );
}
