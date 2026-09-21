import { Helmet } from "react-helmet-async";

export const SITE_NAME = "Приэльбрусье 360";
// Автоматически берёт реальный домен хостинга в браузере (куда бы вы ни залили сайт —
// Netlify, Vercel, Lovable и т.д. — canonical/OG будут указывать на правильный адрес).
// Плейсхолдер ниже используется только при сборке на сервере (для 3 prerender-страниц:
// /, /prielbrusye, /aktivnosti) — там ещё не известен адрес браузера. Если хотите, чтобы
// и они тоже были со 100%-но верным доменом, это единственное место, которое стоит поправить,
// но на возможность залить и открыть сайт это не влияет.
export const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://elbrus360.ru";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`; // TODO: подготовить реальное OG-изображение 1200x630

interface JsonLdObject {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

interface SEOProps {
  /** Заголовок страницы БЕЗ названия сайта — суффикс добавляется автоматически */
  title: string;
  description: string;
  /** Путь без домена, например "/apartments". Используется для canonical и og:url */
  path: string;
  /** noindex для служебных/приватных/дублирующих страниц */
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
  /** Один или несколько JSON-LD блоков (Organization, LocalBusiness, BreadcrumbList, FAQPage и т.д.) */
  jsonLd?: JsonLdObject | JsonLdObject[];
}

/**
 * Единая точка управления SEO-тегами страницы.
 * Каждая публичная страница ДОЛЖНА рендерить <SEO /> с уникальными title/description/path.
 */
export const SEO = ({
  title,
  description,
  path,
  noindex = false,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  jsonLd,
}: SEOProps) => {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const jsonLdBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang="ru" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter/X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

/** Готовые JSON-LD фабрики для переиспользования на страницах */
export const buildOrganizationJsonLd = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Гид по отдыху в Приэльбрусье: жильё, еда, трансфер и веб-камеры Эльбруса.",
  areaServed: {
    "@type": "Place",
    name: "Приэльбрусье",
  },
});

export const buildWebsiteJsonLd = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "ru-RU",
});

export const buildBreadcrumbJsonLd = (
  items: { name: string; path: string }[]
): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
  })),
});
