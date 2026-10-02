import type { CSSProperties } from 'react';
import type { Site } from '../types';

const C = 2 * Math.PI * 18;
const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function SiteCard({ site, i = 0 }: { site: Site; i?: number }) {
  const cats = ([] as string[]).concat(site.ai_categories ?? []).filter(Boolean);
  const summary = site.ai_summary?.trim();
  return (
    <article className="card" style={{ '--i': i } as CSSProperties}>
      <div className="card-head">
        <div className="card-title">
          <h3>{site.title?.trim() || site.domain}</h3>
          <span className="domain">{site.domain}</span>
        </div>
        <div className="dr" title="Domain Rating">
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle className="dr-bg" cx="22" cy="22" r="18" />
            <circle className="dr-fg" cx="22" cy="22" r="18" strokeDasharray={C}
              strokeDashoffset={C * (1 - Math.min(site.dr ?? 0, 100) / 100)} />
          </svg>
          <b>{site.dr ?? '–'}</b>
          <span className="sr">DR</span>
        </div>
      </div>
      <p className="summary">{summary ? summary : 'Опису поки немає.'}</p>
      {cats.length > 0 && (
        <div className="tags">
          {cats.slice(0, 2).map((c) => <span className="tag" key={c}>{c}</span>)}
        </div>
      )}
      <div className="card-foot">
        <span className="live">Онлайн з {fmt(site.went_live)}</span>
        <a className="btn" href={site.url} target="_blank" rel="noopener noreferrer">Перейти на сайт</a>
      </div>
    </article>
  );
}
