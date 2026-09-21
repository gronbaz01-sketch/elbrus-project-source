// Prerender (SSG) script — работает поверх обычной Vite/Lovable-сборки, без миграции на SSR-фреймворк.
//
// Что делает:
// 1. Берёт уже собранный клиентский dist/index.html как шаблон (в нём верные хэшированные пути к JS/CSS).
// 2. Для каждого маршрута из PRERENDER_ROUTES рендерит React в строку через dist-ssr/entry-server.js
//    и вытаскивает собранные react-helmet-async теги (title/meta/OG/canonical/JSON-LD).
// 3. Убирает статичные fallback-теги шаблона (title/description/og:*/twitter:*), чтобы не было дублей,
//    и вставляет на их место реальные теги конкретной страницы.
// 4. Вставляет отрендеренный HTML внутрь <div id="root">...</div>.
// 5. Пишет результат в dist/index.html (для "/") и dist/<route>/index.html (для остальных) —
//    именно такой путь нужен статическим хостингам, чтобы отдавать по /prielbrusye/ статику с этим файлом.
//
// ВАЖНО: сюда специально включены только маршруты БЕЗ данных из Supabase (Index, Prielbrusye, Aktivnosti).
// /apartments, /cafes, /taxi, /cameras остаются client-side rendered — они запрашивают живые данные
// в момент захода пользователя, и в этой песочнице нет сетевого доступа к реальному Supabase-проекту,
// чтобы получить эти данные на этапе сборки. Когда появится SEO Content Engine и понадобится их SEO —
// см. TODO в конце файла.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const SSR_ENTRY = join(__dirname, "..", "dist-ssr", "entry-server.js");

const PRERENDER_ROUTES = ["/", "/prielbrusye", "/aktivnosti"];

function stripStaticFallbackTags(headHtml) {
  return headHtml
    .replace(/<title>.*?<\/title>\s*/s, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="author"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, "");
}

async function main() {
  const { render } = await import(SSR_ENTRY);
  const template = readFileSync(join(DIST_DIR, "index.html"), "utf-8");

  for (const route of PRERENDER_ROUTES) {
    const { html, helmet } = render(route);

    if (!helmet) {
      console.warn(`[prerender] Нет helmet-данных для ${route}, пропускаю head-теги`);
    }

    const helmetHead = helmet
      ? [
          helmet.title.toString(),
          helmet.meta.toString(),
          helmet.link.toString(),
          helmet.script.toString(),
        ].join("\n    ")
      : "";

    let page = template;

    // html lang="ru" и прочие атрибуты <html>, если заданы через <Helmet><html .../></Helmet>
    if (helmet?.htmlAttributes) {
      const attrs = helmet.htmlAttributes.toString();
      page = page.replace(/<html[^>]*>/, `<html ${attrs}>`);
    }

    page = page.replace(
      /<head>([\s\S]*?)<\/head>/,
      (_m, headContent) => `<head>${stripStaticFallbackTags(headContent)}\n    ${helmetHead}\n  </head>`
    );

    page = page.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    const outPath =
      route === "/" ? join(DIST_DIR, "index.html") : join(DIST_DIR, route.slice(1), "index.html");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, page, "utf-8");
    console.log(`[prerender] ✓ ${route} -> ${outPath.replace(DIST_DIR, "dist")}`);
  }
}

main().catch((err) => {
  console.error("[prerender] Ошибка:", err);
  process.exit(1);
});

// TODO (следующий шаг): когда в Admin.tsx появится SEO Content Engine и реальные объекты
// (жильё/кафе/такси) будут иметь стабильные slug'и, можно на этапе сборки один раз запросить
// их из Supabase (сервисным ключом, не anon) и добавить в PRERENDER_ROUTES — тогда и карточки
// объектов будут полноценно prerender'иться, а не только статические информационные страницы.
