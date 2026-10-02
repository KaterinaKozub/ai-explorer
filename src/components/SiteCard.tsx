import type { Site } from '../types';

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function SiteCard({ site }: { site: Site }) {
  const cats = ([] as string[]).concat(site.ai_categories ?? []).filter(Boolean);
  const summary = site.ai_summary?.trim();
  return (
    <article className="card">
      <div className="card-head">
        <div className="card-title">
          <h3>{site.title?.trim() || site.domain}</h3>
          <span className="domain">{site.domain}</span>
        </div>
        <div className="dr" title="Domain Rating">
          <b>{site.dr ?? '–'}</b>
          <span>DR</span>
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
