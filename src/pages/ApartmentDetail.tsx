import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Users, Star, MessageCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO, buildBreadcrumbJsonLd, SITE_URL } from "@/components/seo/SEO";
import { Skeleton } from "@/components/ui/skeleton";

interface ApartmentRow {
  id: string;
  slug: string;
  title: string;
  location: string;
  location_key: string;
  price: number;
  rating: number | null;
  guests: number | null;
  description: string | null;
  image_url: string | null;
  phone: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_h1: string | null;
  noindex: boolean;
}

const ApartmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [apartment, setApartment] = useState<ApartmentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("apartments")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setApartment(data);
        }
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

  if (notFound || !apartment) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <SEO title="Объект не найден" description="Запрошенное жильё не найдено." path={`/apartments/${slug ?? ""}`} noindex />
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title mb-4">Объект не найден</h1>
          <p className="text-muted-foreground mb-6">Возможно, это жильё больше не сдаётся или ссылка устарела.</p>
          <Link to="/apartments" className="text-primary underline underline-offset-4">
            Смотреть всё жильё в Приэльбрусье
          </Link>
        </div>
      </div>
    );
  }

  const title = apartment.seo_title || `${apartment.title} — жильё в ${apartment.location}`;
  const description =
    apartment.seo_description ||
    apartment.description ||
    `${apartment.title}: апартаменты в ${apartment.location}, до ${apartment.guests ?? 2} гостей.`;
  const h1 = apartment.seo_h1 || apartment.title;

  const whatsappMessage = `Здравствуйте! Интересует квартира "${apartment.title}" в ${apartment.location}. Подскажите, есть ли свободные даты?`;
  const whatsappUrl = `https://wa.me/79281234567?text=${encodeURIComponent(whatsappMessage)}`;

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Жильё", path: "/apartments" },
      { name: apartment.title, path: `/apartments/${apartment.slug}` },
    ]),
    {
      "@context": "https://schema.org" as const,
      "@type": "LodgingBusiness",
      name: apartment.title,
      description: apartment.description ?? undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: apartment.location,
        addressRegion: "Кабардино-Балкария",
        addressCountry: "RU",
      },
      url: `${SITE_URL}/apartments/${apartment.slug}`,
      priceRange: `${apartment.price} ₽/сутки`,
      ...(apartment.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: apartment.rating, reviewCount: 1 } } : {}),
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO title={title} description={description} path={`/apartments/${apartment.slug}`} noindex={apartment.noindex} jsonLd={jsonLd} />
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Главная</Link> /{" "}
          <Link to="/apartments" className="hover:text-primary">Жильё</Link> /{" "}
          <span>{apartment.title}</span>
        </nav>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted mb-6">
          {apartment.image_url ? (
            <img src={apartment.image_url} alt={apartment.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-mountain-blue/20 to-accent/10 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <h1 className="section-title mb-3">{h1}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{apartment.location}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />до {apartment.guests ?? 2} гостей</span>
          {apartment.rating && (
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-sunrise-gold fill-sunrise-gold" />{apartment.rating}</span>
          )}
        </div>

        {apartment.description && (
          <p className="text-muted-foreground mb-8 leading-relaxed">{apartment.description}</p>
        )}

        <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-2xl font-bold">{apartment.price.toLocaleString("ru-RU")} ₽</span>
            <span className="text-muted-foreground"> / сутки</span>
          </div>
          <div className="flex gap-3">
            {apartment.phone && (
              <a href={`tel:${apartment.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Phone className="w-4 h-4" /> Позвонить
              </a>
            )}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
              <MessageCircle className="w-4 h-4" /> Написать
            </a>
          </div>
        </div>

        <p className="text-muted-foreground">
          Смотрите также{" "}
          <Link to="/cafes" className="text-primary underline underline-offset-4">кафе поблизости</Link>,{" "}
          <Link to="/taxi" className="text-primary underline underline-offset-4">трансфер</Link> и{" "}
          <Link to="/aktivnosti" className="text-primary underline underline-offset-4">чем заняться</Link> в Приэльбрусье.
        </p>
      </div>
    </div>
  );
};

export default ApartmentDetail;
