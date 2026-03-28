import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  Button,
} from '@blinkdotnew/ui'
import { BookOpen, Gauge, Globe, LogOut, Trophy } from 'lucide-react'

interface StudentSidebarProps {
  pathname: string
  languageLabel: string
  onToggleLanguage: () => void
  onLogout: () => void
}

export default function StudentSidebar({
  pathname,
  languageLabel,
  onToggleLanguage,
  onLogout,
}: StudentSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <span className="font-heading text-lg font-bold">A</span>
          </div>
          <div>
            <p className="font-heading text-base font-semibold text-sidebar-foreground">AceSSC</p>
            <p className="text-xs text-sidebar-foreground/70">Student workspace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarItem icon={<Gauge className="h-4 w-4" />} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} />
          <SidebarItem icon={<BookOpen className="h-4 w-4" />} label="Learn" href="/learn" active={pathname.startsWith('/learn')} />
          <SidebarItem icon={<Trophy className="h-4 w-4" />} label="Progress" href="/progress" active={pathname === '/progress'} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-2 p-2">
          <Button variant="secondary" className="w-full justify-start gap-2" onClick={onToggleLanguage}>
            <Globe className="h-4 w-4" />
            {languageLabel}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:text-sidebar-foreground" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
