"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { itemAdm, items, itemSupport } from "@/app/utils/menu"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/app/context"
import { useNotification } from "@/app/context/Notification" // ✅ IMPORTE CERTO
import Image from "next/image"
import logoMarcaSimbol from "../../../../public/Logo.png"
import BadgeIcon from "../Badger"

export function SideBar() {
  const { user } = useAuth()
  const { notifications } = useNotification() // ✅ PEGA QUANTIDADE MOCKADA
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  function handleNextPage(url: string) {
    setSelectedItem(url)
    router.push(`/dashboard/${url}`)
    setOpenMobile(false)
  }

  return (
    <Sidebar className="flex-1 flex h-screen shadow-xl transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-b from-[#003B73] via-[#2E86C1] to-[#5DADE2] flex-1 flex flex-col p-6">
        {/* HEADER */}
        <SidebarHeader>
          <div className="flex flex-col items-center justify-center gap-2 py-4 px-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
              <Image src={logoMarcaSimbol} alt="Logo" className="w-12 h-12" />
            </div>
            <h1 className="text-white font-black text-xl text-center">
              Nome da empresa
            </h1>
            <span className="text-white/80 text-xs text-center italic font-light">
              Entregando com agilidade
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* MENU NORMAL */}
          {user?.role !== "ADMIN" && (
            <SidebarGroup className="mb-6">
              <SidebarGroupLabel className="text-lg text-white/90 font-semibold mb-3">
                Aplicativo
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {items.map((item) => {
                    const badgeValue =
                      item.title === "notification" ? notifications : item.badge

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a
                            onClick={() => handleNextPage(item.url)}
                            className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition"
                          >
                            <BadgeIcon icon={item.icon} badge={badgeValue} />
                            <span>{item.subTile}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* MENU ADMIN */}
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
