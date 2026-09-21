import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, MessageCircle, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO, buildBreadcrumbJsonLd, SITE_URL } from "@/components/seo/SEO";
import { Skeleton } from "@/components/ui/skeleton";

interface CafeRow {
  id: string;
  slug: string;
  name: string;
  location: string;
  cuisine: string;
  price_range: string | null;
  rating: number | null;
  description: string | null;
  image_url: string | null;
  phone: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_h1: string | null;
  noindex: boolean;
}

const CafeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cafe, setCafe] = useState<CafeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("cafes")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setCafe(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="aspect-[16/9] w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !cafe) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <SEO title="Кафе не найдено" description="Запрошенное кафе не найдено." path={`/cafes/${slug ?? ""}`} noindex />
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title mb-4">Кафе не найдено</h1>
          <p className="text-muted-foreground mb-6">Возможно, заведение закрылось или ссылка устарела.</p>
          <Link to="/cafes" className="text-primary underline underline-offset-4">
            Смотреть все кафе Приэльбрусья
          </Link>
        </div>
      </div>
    );
  }

  const title = cafe.seo_title || `${cafe.name} — ${cafe.cuisine} в ${cafe.location}`;
  const description =
    cafe.seo_description || cafe.description || `${cafe.name}: ${cafe.cuisine} в ${cafe.location}, Приэльбрусье.`;
  const h1 = cafe.seo_h1 || cafe.name;
  const whatsappMessage = `Здравствуйте! Хотел бы забронировать столик в кафе "${cafe.name}". Подскажите, есть ли свободные места?`;
  const whatsappUrl = `https://wa.me/79281234567?text=${encodeURIComponent(whatsappMessage)}`;

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Кафе", path: "/cafes" },
      { name: cafe.name, path: `/cafes/${cafe.slug}` },
    ]),
    {
      "@context": "https://schema.org" as const,
      "@type": "Restaurant",
      name: cafe.name,
      description: cafe.description ?? undefined,
      servesCuisine: cafe.cuisine,
      address: {
        "@type": "PostalAddress",
        addressLocality: cafe.location,
        addressRegion: "Кабардино-Балкария",
        addressCountry: "RU",
      },
      url: `${SITE_URL}/cafes/${cafe.slug}`,
      priceRange: cafe.price_range ?? undefined,
      ...(cafe.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: cafe.rating, reviewCount: 1 } } : {}),
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO title={title} description={description} path={`/cafes/${cafe.slug}`} noindex={cafe.noindex} jsonLd={jsonLd} />
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Главная</Link> /{" "}
          <Link to="/cafes" className="hover:text-primary">Кафе</Link> /{" "}
          <span>{cafe.name}</span>
        </nav>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted mb-6">
          {cafe.image_url ? (
            <img src={cafe.image_url} alt={cafe.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sunset/20 to-accent/10 flex items-center justify-center">
              <Utensils className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <h1 className="section-title mb-3">{h1}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{cafe.location}</span>
          <span>{cafe.cuisine}</span>
          {cafe.price_range && <span>{cafe.price_range}</span>}
          {cafe.rating && (
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-sunrise-gold fill-sunrise-gold" />{cafe.rating}</span>
          )}
        </div>

        {cafe.description && <p className="text-muted-foreground mb-8 leading-relaxed">{cafe.description}</p>}

        <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 mb-10">
          <span className="text-muted-foreground">Забронировать столик:</span>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            <MessageCircle className="w-4 h-4" /> Написать
          </a>
        </div>

        <p className="text-muted-foreground">
          Также посмотрите{" "}
          <Link to="/apartments" className="text-primary underline underline-offset-4">жильё рядом</Link>,{" "}
          <Link to="/taxi" className="text-primary underline underline-offset-4">трансфер</Link> и{" "}
          <Link to="/aktivnosti" className="text-primary underline underline-offset-4">чем заняться</Link> в Приэльбрусье.
        </p>
      </div>
    </div>
  );
};

export default CafeDetail;
