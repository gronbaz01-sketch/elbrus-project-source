import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Если контейнер уже содержит разметку — значит страница была prerender'ена на этапе сборки
// (см. scripts/prerender.mjs), и её нужно гидрировать, а не перерисовывать с нуля.
// Для остальных (client-only) маршрутов контейнер пуст — обычный CSR-рендер.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
