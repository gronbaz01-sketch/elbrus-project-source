// Edge Function: динамический sitemap объектов (жильё/кафе/такси).
// Деплой: supabase functions deploy sitemap-objects
// Доступен по адресу вида: https://<project-ref>.supabase.co/functions/v1/sitemap-objects
//
// В отличие от public/sitemap.xml (статический, для страниц-разделов), этот sitemap
// генерируется на каждый запрос из реальных данных БД — как и требует SEO_SITEMAP
// ("должен автоматически обновляться при появлении/изменении индексируемых страниц").
//
// Подключение: добавить вторую строку Sitemap в robots.txt (sitemap index — можно
// указывать несколько Sitemap: строк), например:
//   Sitemap: https://elbrus360.ru/sitemap.xml
//   Sitemap: https://<project-ref>.supabase.co/functions/v1/sitemap-objects

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://elbrus360.ru"; // TODO: тот же реальный домен, что и в src/components/seo/SEO.tsx

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [apartments, cafes, taxi] = await Promise.all([
    supabase.from("apartments").select("slug, updated_at, noindex").eq("is_active", true),
    supabase.from("cafes").select("slug, updated_at, noindex").eq("is_active", true),
    supabase.from("taxi_services").select("slug, updated_at, noindex").eq("is_active", true),
  ]);

  const sections: { prefix: string; rows: { slug: string; updated_at: string; noindex: boolean }[] | null }[] = [
    { prefix: "apartments", rows: apartments.data },
    { prefix: "cafes", rows: cafes.data },
    { prefix: "taxi", rows: taxi.data },
  ];

  const urls = sections.flatMap(({ prefix, rows }) =>
    (rows ?? [])
      .filter((row) => !row.noindex)
      .map(
        (row) => `  <url>
    <loc>${SITE_URL}/${prefix}/${row.slug}</loc>
    <lastmod>${new Date(row.updated_at).toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
      )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});
