/**
 * QuickActions — Three clickable cards for fast navigation.
 */
import { Card, CardContent, Badge } from '@blinkdotnew/ui'
import { BookOpen, BarChart3, Bot, ArrowRight } from 'lucide-react'

interface QuickActionsProps {
  t: (en: string, bn: string) => string
  baseDelay: number
}

const actions = [
  {
    icon: BookOpen,
    titleEn: 'Continue Learning',
    titleBn: 'পড়া চালিয়ে যাও',
    descEn: 'Pick up where you left off',
    descBn: 'যেখানে থেমেছিলে সেখান থেকে শুরু করো',
    href: '/learn',
    comingSoon: false,
    iconColor: 'bg-accent/10 text-accent',
  },
  {
    icon: BarChart3,
    titleEn: 'View Progress',
    titleBn: 'অগ্রগতি দেখো',
    descEn: 'Track your chapter mastery',
    descBn: 'তোমার অধ্যায়ের দক্ষতা দেখো',
    href: '/progress',
    comingSoon: false,
    iconColor: 'bg-[hsl(var(--chart-3)/.1)] text-chart-3',
  },
  {
    icon: Bot,
    titleEn: 'AI Tutor',
    titleBn: 'AI শিক্ষক',
    descEn: 'Get personalized help',
    descBn: 'ব্যক্তিগত সাহায্য নাও',
    href: '#',
    comingSoon: true,
    iconColor: 'bg-[hsl(var(--chart-4)/.1)] text-chart-4',
  },
]

export function QuickActions({ t, baseDelay }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <a
            key={action.href + action.titleEn}
            href={action.comingSoon ? undefined : action.href}
            className="no-underline"
          >
            <Card
              className="
                animate-slide-up group cursor-pointer
                transition-all duration-200
                hover:shadow-lg hover:scale-[1.02] hover:border-accent/30
                active:scale-[0.98]
              "
              style={{
                animationDelay: `${baseDelay + i * 80}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <CardContent className="flex items-start gap-3 py-5 px-5 relative">
                {action.comingSoon && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 text-[10px] px-1.5 py-0.5"
                  >
                    {t('Soon', 'শীঘ্রই')}
                  </Badge>
                )}

                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                    ${action.iconColor}
                    transition-transform duration-200 group-hover:scale-110
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground">
                      {t(action.titleEn, action.titleBn)}
                    </p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(action.descEn, action.descBn)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        )
      })}
    </div>
  )
}
