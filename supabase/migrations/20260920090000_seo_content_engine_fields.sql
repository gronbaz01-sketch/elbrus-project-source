-- SEO Content Engine: поля для управления SEO у конкретных объектов из админки,
-- и slug для формирования человекочитаемых URL детальных страниц объектов
-- (/apartments/:slug, /cafes/:slug, /taxi/:slug — см. SEO_PROGRAMMATIC_PAGES в ТЗ).
--
-- slug по умолчанию = id (гарантированно уникален и не требует транслитерации кириллицы
-- на уровне БД). Администратор может задать человекочитаемый slug вручную через форму
-- в Admin.tsx — уникальность в этом случае обеспечивает UNIQUE-констрейнт ниже.

ALTER TABLE public.apartments
  ADD COLUMN slug TEXT,
  ADD COLUMN seo_title TEXT,
  ADD COLUMN seo_description TEXT,
  ADD COLUMN seo_h1 TEXT,
  ADD COLUMN noindex BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.cafes
  ADD COLUMN slug TEXT,
  ADD COLUMN seo_title TEXT,
  ADD COLUMN seo_description TEXT,
  ADD COLUMN seo_h1 TEXT,
  ADD COLUMN noindex BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.taxi_services
  ADD COLUMN slug TEXT,
  ADD COLUMN seo_title TEXT,
  ADD COLUMN seo_description TEXT,
  ADD COLUMN seo_h1 TEXT,
  ADD COLUMN noindex BOOLEAN NOT NULL DEFAULT false;

-- Заполняем slug у уже существующих записей значением id, чтобы поле сразу было
-- пригодно для построения URL и не оставалось NULL.
UPDATE public.apartments SET slug = id::text WHERE slug IS NULL;
UPDATE public.cafes SET slug = id::text WHERE slug IS NULL;
UPDATE public.taxi_services SET slug = id::text WHERE slug IS NULL;

ALTER TABLE public.apartments ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.cafes ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.taxi_services ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.apartments ADD CONSTRAINT apartments_slug_key UNIQUE (slug);
ALTER TABLE public.cafes ADD CONSTRAINT cafes_slug_key UNIQUE (slug);
ALTER TABLE public.taxi_services ADD CONSTRAINT taxi_services_slug_key UNIQUE (slug);

CREATE INDEX idx_apartments_slug ON public.apartments (slug);
CREATE INDEX idx_cafes_slug ON public.cafes (slug);
CREATE INDEX idx_taxi_services_slug ON public.taxi_services (slug);
