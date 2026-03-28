/**
 * ChatHistory — Left sidebar listing past AI Tutor conversations.
 */
import { Button } from '@blinkdotnew/ui'
import { Bot, Plus, MessageSquare } from 'lucide-react'

interface AiTutorChat {
  id: string
  title: string
  updatedAt: string
}

interface ChatHistoryProps {
  chats: AiTutorChat[]
  activeChatId: string | null
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
}

export function ChatHistory({
  chats,
  activeChatId,
  lang,
  t,
  onNewChat,
  onSelectChat,
}: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <span className="font-heading font-semibold text-foreground">
            {t('AI Tutor', 'AI শিক্ষক')}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onNewChat} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b border-border" />

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto chat-scroll px-2 py-2 space-y-0.5">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t(
                'Start a conversation with your AI tutor',
                'তোমার AI শিক্ষকের সাথে কথা শুরু করো',
              )}
            </p>
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === activeChatId
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group
                  ${isActive
                    ? 'bg-accent/10 border-l-2 border-accent'
                    : 'hover:bg-muted/60 border-l-2 border-transparent'
                  }`}
              >
                <p className={`text-sm truncate ${isActive ? 'font-medium text-foreground' : 'text-foreground/80'}`}>
                  {chat.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {relativeTime(chat.updatedAt, lang)}
                </p>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function relativeTime(dateStr: string, lang: 'en' | 'bn'): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return lang === 'bn' ? 'এইমাত্র' : 'just now'
  if (minutes < 60) return lang === 'bn' ? `${minutes} মি. আগে` : `${minutes}m ago`
  if (hours < 24) return lang === 'bn' ? `${hours} ঘ. আগে` : `${hours}h ago`
  return lang === 'bn' ? `${days} দিন আগে` : `${days}d ago`
}
