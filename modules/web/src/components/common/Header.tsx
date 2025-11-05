'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { SignedOut, SignInButton } from '@clerk/nextjs'
import { BarChart2, LayoutDashboard, Package, Settings } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const useRoutes = () => {
  const { t } = useTranslation()

  return [
    {
      name: t('navigation.dashboard'),
      route: '/',
      icon: LayoutDashboard,
    },
    {
      name: t('navigation.items'),
      route: '/items',
      icon: Package,
    },
    {
      name: t('navigation.search'),
      route: '/search',
      icon: Package,
    },
    {
      name: t('navigation.report'),
      route: '/report',
      icon: BarChart2,
    },
  ]
}

export default function AppSidebar() {
  const { t } = useTranslation()
  const routes = useRoutes()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="inline-flex items-center gap-2 px-2">
          <span className="text-base font-bold tracking-tight">
            RBI Inventory
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map(({ name, route, icon: Icon }) => {
                return (
                  <SidebarMenuItem key={route}>
                    <SidebarMenuButton asChild isActive={false}>
                      <Link href={route}>
                        <Icon />
                        <span>{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={false}>
              <Link href="/settings">
                <Settings />
                <span>{t('navigation.settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  )
}
