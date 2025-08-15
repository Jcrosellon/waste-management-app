import type { Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"
import { adminGuard } from "./guards/admin.guard"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "schedule",
    loadComponent: () => import("./pages/schedule/schedule.component").then((m) => m.ScheduleComponent),
    canActivate: [authGuard],
  },
  {
    path: "reports",
    loadComponent: () => import("./pages/reports/reports.component").then((m) => m.ReportsComponent),
    canActivate: [authGuard],
  },
  {
    path: "notifications",
    loadComponent: () => import("./pages/notifications/notifications.component").then((m) => m.NotificationsComponent),
    canActivate: [authGuard],
  },
  {
    path: "users",
    loadComponent: () => import("./pages/users/users.component").then((m) => m.UsersComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "discounts",
    loadComponent: () => import("./pages/discounts/discounts.component").then((m) => m.DiscountsComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "configuration",
    loadComponent: () => import("./pages/configuration/configuration.component").then((m) => m.ConfigurationComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "rewards",
    loadComponent: () => import("./pages/rewards/rewards.component").then((m) => m.RewardsComponent),
    canActivate: [authGuard],
  },
  {
    path: "admin",
    loadComponent: () => import("./pages/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
]
