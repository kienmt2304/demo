import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "./app.css";

import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import CommandSpotlight from "./components/CommandSpotlight";
import Modal from "./components/Modal";
import NotificationProvider from "./components/Providers/NotificationProvider";
import { ThemeProvider } from "@demo/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <CommandSpotlight />
            {children}
            <Modal />
            <NotificationProvider />
          </ThemeProvider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
