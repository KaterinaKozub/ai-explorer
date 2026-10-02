# AI Explorer
AI Explorer — каталог AI-сайтів

Невеликий веб-проєкт (тестове завдання) на React + TypeScript + Vite, який будує каталог AI-сервісів виключно на даних публічного FreeSerp API — без API key, без реєстрації, без мокових даних.

## Запуск
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # збірка у dist/
```
Потрібен Node.js 18+.

## Структура
- `src/api.ts` — єдиний запит до `https://freeserp.ai/api.php`
- `src/pages/Catalog.tsx` — головна: пошук, фільтри, сортування, картки, Load More, стани loading/error/empty
- `src/pages/About.tsx` — про проєкт
- `src/components/SiteCard.tsx` — картка сайту
- `src/hooks/useDebounced.ts` — затримка пошуку 400 мс
- Навігація через `#/` і `#/about` (без react-router)

## Параметри API
`q`, `ai_categories`, `dr_min`, `sort` (`relevance` / `dr` / `went_live`), `order`, `size=12`, `from` (Load More).
Додаткові `agent`/`project` необов'язкові й просто ідентифікують застосунок.

`went_live` — дата першого підтвердження, що сайт працює, а не офіційний запуск.

## Якщо в браузері «Failed to fetch»
За замовчуванням запити йдуть через проксі Vite (`/freeserp` → `https://freeserp.ai`), тому працюють у `npm run dev` і `npm run preview`.
Для статичного хостингу (де проксі немає) створіть `.env` з `VITE_API_BASE=https://freeserp.ai` — тоді браузер звертатиметься до API напряму (потрібен відкритий CORS).
Після зміни `vite.config.ts` перезапустіть `npm run dev`.
