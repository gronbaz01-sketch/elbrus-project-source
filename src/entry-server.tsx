import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import App from "./App.tsx";

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <StaticRouter location={url}>
      <App helmetContext={helmetContext} />
    </StaticRouter>
  );

  return { html, helmet: helmetContext.helmet };
}
