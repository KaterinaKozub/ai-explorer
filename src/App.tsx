import { useEffect, useState } from 'react';
import Catalog from './pages/Catalog';
import About from './pages/About';
import Constellation from './components/Constellation';

const route = () => (location.hash === '#/about' ? 'about' : 'home');

export default function App() {
  const [page, setPage] = useState(route());

  useEffect(() => {
    const onHash = () => { setPage(route()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <>
      <Constellation />
      <header className="top">
        <div className="wrap top-in">
          <a className="logo" href="#/"><span className="dot" aria-hidden="true" />AI Explorer</a>
          <nav aria-label="Основна навігація">
            <a href="#/" aria-current={page === 'home' ? 'page' : undefined}>Каталог</a>
            <a href="#/about" aria-current={page === 'about' ? 'page' : undefined}>Про проєкт</a>
          </nav>
        </div>
      </header>
      <main className="wrap page" key={page}>{page === 'home' ? <Catalog /> : <About />}</main>
      <footer className="wrap foot">Дані: <a href="https://freeserp.ai" target="_blank" rel="noopener noreferrer">FreeSerp</a> (index=sites)</footer>
    </>
  );
}
