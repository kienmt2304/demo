import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("settings", "routes/home.tsx", { id: "home-settings" }, [
      index("routes/settings.tsx"),
    ]),
    layout("routes/nav-layout.tsx", [
      route("table", "routes/table.tsx"),
      route("onboarding", "routes/onboarding.tsx"),
      route("upload", "routes/upload.tsx"),
      route("booking", "routes/booking.tsx"),
      route("chat", "routes/chat.tsx"),
      route("analytics", "routes/analytics.tsx"),
      route("infinite-scroll", "routes/infinite-scroll.tsx"),
    ]),
  ]),
  route("modules/*", "routes/module.tsx"),
  route("images", "routes/api/images.ts"),
  route("users", "routes/api/users.ts"),
  route("/users/:id", "routes/api/users.ts", { id: "user-action" }),
  route("users", "routes/api/users.ts", { id: "user-delete" }),
  route("users/status", "routes/api/user-status.ts"),
  route("/analytics/:range", "routes/api/analytics.ts"),
] satisfies RouteConfig;
