import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO, buildBreadcrumbJsonLd } from "@/components/seo/SEO";

const Prielbrusye = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SEO
        title="Приэльбрусье — отдых у подножия Эльбруса: что важно знать"
        description="Приэльбрусье: где находится, как добраться, когда ехать, чем заняться. Главный гид по отдыху у Эльбруса — жильё, еда, трансфер и активности."
        path="/prielbrusye"
        jsonLd={buildBreadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Приэльбрусье", path: "/prielbrusye" },
        ])}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="section-title mb-6">Приэльбрусье</h1>

        <p className="text-lg text-muted-foreground mb-8">
          Приэльбрусье — горный район в Кабардино-Балкарии, в верховьях Баксанского ущелья, у подножия
          Эльбруса — высочайшей вершины России и Европы (5642 м — западная вершина, 5621 м — восточная).
          Это один из главных горнолыжных и туристических центров Северного Кавказа: сюда едут кататься
          зимой, гулять и подниматься в горы летом, снимать панораму на канатных дорогах — в любое время года.
        </p>

        <h2 className="text-2xl font-display font-semibold mb-4 mt-10">Как добраться</h2>
        <p className="text-muted-foreground mb-8">
          Ближайший аэропорт — Минеральные Воды, дальше около 180 км по дороге через Баксанское ущелье
          (обычно 3–3,5 часа на машине или трансфере). Можно доехать на автобусе, такси или заказать
          трансфер заранее — подробнее на странице{" "}
          <Link to="/taxi" className="text-primary underline underline-offset-4">
            «Такси и трансфер»
          </Link>
          .
        </p>

        <h2 className="text-2xl font-display font-semibold mb-4 mt-10">Когда ехать</h2>
        <p className="text-muted-foreground mb-8">
          Приэльбрусье — круглогодичное направление. Зимний сезон (примерно с ноября по май) — это горные
          лыжи и сноуборд на склонах Чегета и Эльбруса. Летний сезон (июнь–сентябрь) — треккинг, конные
          прогулки, поездки к ледникам и водопадам, восхождения на Эльбрус. Весна и осень — межсезонье с
          переменчивой погодой, но меньшим количеством туристов и более доступными ценами на жильё.
        </p>

        <h2 className="text-2xl font-display font-semibold mb-4 mt-10">Основные локации</h2>
        <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
          <li><strong>Терскол</strong> — посёлок, основная база для проживания и снабжения.</li>
          <li><strong>Поляна Азау</strong> — нижняя станция канатной дороги на Эльбрус, начало маршрутов.</li>
          <li><strong>Поляна Чегет</strong> — горнолыжный склон с одними из самых крутых трасс региона.</li>
          <li><strong>Байдаево</strong> — жилой посёлок неподалёку от основных туристических точек.</li>
        </ul>

        <h2 className="text-2xl font-display font-semibold mb-4 mt-10">Что нужно для поездки</h2>
        <p className="text-muted-foreground mb-8">
          Выбрать и забронировать{" "}
          <Link to="/apartments" className="text-primary underline underline-offset-4">
            жильё
          </Link>
          , продумать{" "}
          <Link to="/taxi" className="text-primary underline underline-offset-4">
            трансфер
          </Link>
          , посмотреть варианты{" "}
          <Link to="/cafes" className="text-primary underline underline-offset-4">
            питания
          </Link>{" "}
          и заранее решить, чем заняться — на странице{" "}
          <Link to="/aktivnosti" className="text-primary underline underline-offset-4">
            «Активности»
          </Link>
          . Перед поездкой в горы полезно заранее проверить актуальную погоду и обстановку на склонах —
          для этого на сайте есть{" "}
          <Link to="/cameras" className="text-primary underline underline-offset-4">
            онлайн-камеры
          </Link>
          .
        </p>

        <div className="glass-card p-8 mt-12">
          <h2 className="text-xl font-display font-semibold mb-3">С чего начать?</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/apartments" className="btn-hero">
              Найти жильё <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/aktivnosti" className="btn-hero">
              Чем заняться <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prielbrusye;
