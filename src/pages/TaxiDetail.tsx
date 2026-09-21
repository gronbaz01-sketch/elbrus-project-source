import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, MessageCircle, Car, Star, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO, buildBreadcrumbJsonLd, SITE_URL } from "@/components/seo/SEO";
import { Skeleton } from "@/components/ui/skeleton";

interface TaxiRow {
  id: string;
  slug: string;
  name: string;
  phone: string;
  description: string | null;
  rating: number | null;
  verified: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_h1: string | null;
  noindex: boolean;
}

const TaxiDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [taxi, setTaxi] = useState<TaxiRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("taxi_services")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setTaxi(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !taxi) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <SEO title="Служба такси не найдена" description="Запрошенная служба такси не найдена." path={`/taxi/${slug ?? ""}`} noindex />
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title mb-4">Не найдено</h1>
          <p className="text-muted-foreground mb-6">Возможно, эта запись больше не активна.</p>
          <Link to="/taxi" className="text-primary underline underline-offset-4">
            Смотреть всё такси и трансфер
          </Link>
        </div>
      </div>
    );
  }

  const title = taxi.seo_title || `${taxi.name} — такси и трансфер в Приэльбрусье`;
  const description = taxi.seo_description || taxi.description || `${taxi.name}: трансфер и такси в Приэльбрусье.`;
  const h1 = taxi.seo_h1 || taxi.name;
  const formattedPhone = taxi.phone.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(
    "Здравствуйте! Нужно такси в Приэльбрусье. Подскажите стоимость поездки?"
  )}`;

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Такси", path: "/taxi" },
      { name: taxi.name, path: `/taxi/${taxi.slug}` },
    ]),
    {
      "@context": "https://schema.org" as const,
      "@type": "Service",
      serviceType: "Такси и трансфер",
      provider: { "@type": "Person", name: taxi.name },
      areaServed: { "@type": "Place", name: "Приэльбрусье" },
      description: taxi.description ?? undefined,
      url: `${SITE_URL}/taxi/${taxi.slug}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO title={title} description={description} path={`/taxi/${taxi.slug}`} noindex={taxi.noindex} jsonLd={jsonLd} />
      <div className="container mx-auto px-4 max-w-2xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Главная</Link> /{" "}
          <Link to="/taxi" className="hover:text-primary">Такси</Link> /{" "}
          <span>{taxi.name}</span>
        </nav>

        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-mountain-blue-light flex items-center justify-center text-white">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold flex items-center gap-2">
                {h1}
                {taxi.verified && <CheckCircle className="w-5 h-5 text-forest-green" />}
              </h1>
              {taxi.rating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 text-sunrise-gold fill-sunrise-gold" />
                  <span>{taxi.rating}</span>
                  {taxi.verified && <span className="ml-1">• Проверенный</span>}
                </div>
              )}
            </div>
          </div>

          {taxi.description && <p className="text-muted-foreground mb-6">{taxi.description}</p>}

          <div className="flex gap-3">
            <a href={`tel:${formattedPhone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" /> {taxi.phone}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition-colors" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        <p className="text-muted-foreground">
          Смотрите также{" "}
          <Link to="/apartments" className="text-primary underline underline-offset-4">жильё</Link>,{" "}
          <Link to="/cafes" className="text-primary underline underline-offset-4">кафе</Link> и{" "}
          <Link to="/aktivnosti" className="text-primary underline underline-offset-4">чем заняться</Link> в Приэльбрусье.
        </p>
      </div>
    </div>
  );
};

export default TaxiDetail;
