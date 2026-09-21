import { Link } from "react-router-dom";
import { SEO, buildBreadcrumbJsonLd } from "@/components/seo/SEO";

const activities = [
  {
    title: "Канатная дорога на Эльбрус",
    description:
      "Три очереди канатной дороги (Азау — Кругозор — Мир — Гарабаши) поднимают на высоту около 3800 м без специальной подготовки и снаряжения. Отличная смотровая точка круглый год.",
  },
  {
    title: "Гора Чегет",
    description:
      "Подъёмник и одни из самых сложных горнолыжных трасс региона зимой; летом — пешие маршруты и виды на Донгузорун и Эльбрус.",
  },
  {
    title: "Треккинг и горные походы",
    description:
      "Маршруты разной сложности: от однодневных прогулок до многодневных походов к ледникам и водопадам Азау, Терскол и Ирикчат.",
  },
  {
    title: "Восхождение на Эльбрус",
    description:
      "Классические маршруты с юга и севера требуют акклиматизации и, как правило, сопровождения гида — это высотное восхождение, а не прогулка.",
  },
  {
    title: "Национальный парк «Приэльбрусье»",
    description:
      "Охраняемая территория с маршрутами для прогулок, смотровыми площадками и разнообразной горной природой.",
  },
  {
    title: "Конные прогулки",
    description: "Прогулки верхом на карачаевских лошадях — популярный летний формат активности для семей.",
  },
];

const Aktivnosti = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO
        title="Чем заняться в Приэльбрусье — активности и развлечения"
        description="Чем заняться в Приэльбрусье: канатная дорога на Эльбрус, гора Чегет, треккинг, восхождения, конные прогулки. Обзор активностей на любой сезон."
        path="/aktivnosti"
        jsonLd={buildBreadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Активности", path: "/aktivnosti" },
        ])}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h1 className="section-title mb-4">Чем заняться в Приэльбрусье</h1>
          <p className="text-muted-foreground max-w-2xl">
            Приэльбрусье интересно в любой сезон — от горных лыж зимой до треккинга и восхождений летом.
            Вот основные форматы активностей в районе.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((a) => (
            <div key={a.title} className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-2">{a.title}</h2>
              <p className="text-muted-foreground text-sm">{a.description}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-10">
          Планируете поездку целиком? Начните со страницы{" "}
          <Link to="/prielbrusye" className="text-primary underline underline-offset-4">
            «Приэльбрусье»
          </Link>
          , подберите{" "}
          <Link to="/apartments" className="text-primary underline underline-offset-4">
            жильё
          </Link>{" "}
          и{" "}
          <Link to="/taxi" className="text-primary underline underline-offset-4">
            трансфер
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Aktivnosti;
