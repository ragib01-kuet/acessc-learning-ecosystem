/**
 * TaskCard — A single task row for the daily task list.
 */
import {
  Card,
  CardContent,
  Badge,
  Button,
} from '@blinkdotnew/ui'
import {
  BookOpen,
  Brain,
  RotateCcw,
  FileCheck,
  CheckCircle2,
} from 'lucide-react'

const TASK_ICONS: Record<string, React.ReactNode> = {
  lecture: <BookOpen className="h-5 w-5" />,
  practice: <Brain className="h-5 w-5" />,
  revision: <RotateCcw className="h-5 w-5" />,
  test: <FileCheck className="h-5 w-5" />,
}

const ICON_BG: Record<string, string> = {
  lecture: 'bg-accent/10 text-accent',
  practice: 'bg-[hsl(var(--chart-3)/.1)] text-chart-3',
  revision: 'bg-[hsl(var(--chart-2)/.1)] text-chart-2',
  test: 'bg-[hsl(var(--chart-5)/.1)] text-chart-5',
}

interface TaskCardProps {
  task: {
    id: string
    taskType: 'lecture' | 'practice' | 'revision' | 'test'
    title: string
    titleBn: string
    description: string
    status: 'pending' | 'completed' | 'skipped'
  }
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  delay: number
}

export function TaskCard({ task, lang, t, onComplete, onSkip, delay }: TaskCardProps) {
  const isCompleted = task.status === 'completed'
  const isSkipped = task.status === 'skipped'
  const isDone = isCompleted || isSkipped

  const displayTitle = lang === 'bn' ? task.titleBn : task.title

  return (
    <Card
      className={`
        animate-slide-up transition-all duration-200
        ${isDone ? 'opacity-60' : 'border-accent/30 hover:border-accent/50 hover:shadow-md'}
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <CardContent className="flex items-center gap-4 py-4 px-4 sm:px-6">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${isDone ? 'bg-muted text-muted-foreground' : ICON_BG[task.taskType]}
          `}
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            TASK_ICONS[task.taskType]
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`
              font-medium text-sm sm:text-base truncate
              ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}
            `}
          >
            {displayTitle}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
            {task.description}
          </p>
        </div>

        {/* Status + Actions */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isCompleted && (
            <Badge variant="secondary" className="text-xs">
              {t('Done', 'সম্পন্ন')}
            </Badge>
          )}
          {isSkipped && (
            <Badge variant="outline" className="text-xs">
              {t('Skipped', 'বাদ দেওয়া')}
            </Badge>
          )}
          {!isDone && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onSkip(task.id)}
              >
                {t('Skip', 'বাদ')}
              </Button>
              <Button
                size="sm"
                onClick={() => onComplete(task.id)}
                className="text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                {t('Complete', 'সম্পন্ন')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
