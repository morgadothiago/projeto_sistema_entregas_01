import {
  Home,
  Car,
  DollarSign,
  User,
  RefreshCcw,
  Bell,
  Mail,
  Store,
  LucideIcon,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export interface MenuItem {
  title: string
  subTile: string
  url: string
  icon: LucideIcon
  badge?: number
}

// Exemplo mockado de notificações
const NotificationItems = 3

export const items: MenuItem[] = [
  {
    title: "Home",
    subTile: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "simulate",
    subTile: "Simulação de entrega",
    url: "simulate",
    icon: RefreshCcw,
  },
  {
    title: "delivryDetails",
    subTile: "Detalhes da entrega",
    url: "/delivery",
    icon: Car,
  },
  {
    title: "debts",
    subTile: "Débitos",
    url: "/debts",
    icon: DollarSign,
  },
  {
    title: "notification",
    subTile: "Notificações",
    url: "/notification",
    icon: Bell,
    badge: NotificationItems, // 👈 Aqui controla o badge
  },
]

export const itemAdm: MenuItem[] = [
  {
    title: "/admin/type-vehicle",
    subTile: "Tipo de Veículos",
    url: "/type-vehicle",
    icon: Car,
  },
  {
    title: "/admin/listuser",
    subTile: "Listagem de Usuários",
    url: "/user",
    icon: User,
  },
  {
    title: "/admin/stores",
    subTile: "Logista",
    url: "/stores",
    icon: Store,
  },
  {
    title: "/admin/notification_admin",
    subTile: "Notificações_admin",
    url: "/notification_admin",
    icon: Bell,
    badge: NotificationItems, // 👈 Aqui também
  },
]

export const itemSupport = [
  {
    title: "Email",
    action: () => {},
    icon: Mail,
  },
  {
    title: "WhatsApp",
    action: () => {},
    icon: FaWhatsapp,
  },
]
