/**
 * AppSidebar — Navigation sidebar for AceSSC learning platform.
 *
 * Uses @blinkdotnew/ui Sidebar components with the deep navy sidebar theme.
 * Fully bilingual (en/bn). Shows nav items, stats, language toggle, and logout.
 */
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSeparator,
  Button,
  Badge,
} from '@blinkdotnew/ui'
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  ClipboardCheck,
  Bot,
  Search,
  Languages,
  LogOut,
} from 'lucide-react'

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  streak: number
  xp: number
  userName: string
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onLanguageToggle: () => void
  onLogout: () => void
}

function AppSidebar({
  currentPage,
  onNavigate,
  streak,
  xp,
  userName,
  lang,
  t,
  onLanguageToggle,
  onLogout,
}: AppSidebarProps) {
  return (
    <Sidebar>
      {/* ── Brand Header ── */}
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-lg font-bold tracking-tight">
            AceSSC
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            90-Day Plan
          </Badge>
        </div>
      </SidebarHeader>

      {/* ── Navigation Groups ── */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t('Main', 'প্রধান')}
          </SidebarGroupLabel>
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label={t('Dashboard', 'ড্যাশবোর্ড')}
            href="/dashboard"
            active={currentPage === 'dashboard'}
          />
          <SidebarItem
            icon={<BookOpen className="h-4 w-4" />}
            label={t('Learn', 'পড়াশোনা')}
            href="/learn"
            active={currentPage === 'learn'}
          />
          <SidebarItem
            icon={<BarChart3 className="h-4 w-4" />}
            label={t('Progress', 'অগ্রগতি')}
            href="/progress"
            active={currentPage === 'progress'}
          />
          <SidebarItem
            icon={<ClipboardCheck className="h-4 w-4" />}
            label={t('Exams', 'পরীক্ষা')}
            href="/exam"
            active={currentPage === 'exam'}
          />
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t('Tools', 'টুলস')}
          </SidebarGroupLabel>
          <SidebarItem
            icon={<Bot className="h-4 w-4" />}
            label={t('AI Tutor', 'AI শিক্ষক')}
            href="/tutor"
            active={currentPage === 'tutor'}
          />
          <SidebarItem
            icon={<Search className="h-4 w-4" />}
            label={t('Book Search', 'বই খুঁজুন')}
            href="/dashboard"
            active={currentPage === 'search'}
            badge={t('Soon', 'শীঘ্রই')}
          />
        </SidebarGroup>

        <SidebarSeparator />

        {/* Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t('Stats', 'পরিসংখ্যান')}
          </SidebarGroupLabel>
          <div className="px-3 py-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/70">
                🔥 {t('Streak', 'ধারাবাহিকতা')}
              </span>
              <span className="font-semibold tabular-nums text-sidebar-foreground">
                {streak} {t('days', 'দিন')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/70">
                ⭐ XP
              </span>
              <span className="font-semibold tabular-nums text-sidebar-foreground">
                {xp} XP
              </span>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: Lang Toggle + User + Logout ── */}
      <SidebarFooter>
        <div className="space-y-2">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onLanguageToggle}
          >
            <Languages className="h-4 w-4" />
            <span className="text-sm">{lang === 'en' ? 'বাং' : 'EN'}</span>
          </Button>

          {/* User name */}
          <div className="px-2 py-1">
            <p className="text-xs text-sidebar-foreground/50 truncate">
              {userName}
            </p>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">{t('Logout', 'লগ আউট')}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
