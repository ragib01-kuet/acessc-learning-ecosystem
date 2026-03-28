/**
 * TutorPage — Full chat interface for the AceSSC AI Tutor.
 *
 * Two-panel layout: chat history (left) + active chat (right).
 * On mobile, history is an overlay toggled by a button.
 * Uses @blinkdotnew/ui primitives + lucide-react icons.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@blinkdotnew/ui'
import { SendHorizonal, MessageSquare, X, Loader2 } from 'lucide-react'
import { ChatHistory } from './tutor/ChatHistory'
import { ChatMessage } from './tutor/ChatMessage'
import { WelcomeScreen } from './tutor/WelcomeScreen'

interface AiTutorChat { id: string; userId: string; title: string; subject: string; chapterId: string; createdAt: string; updatedAt: string }
interface AiTutorMessage { id: string; chatId: string; userId: string; role: 'user' | 'assistant'; content: string; createdAt: string }

interface TutorPageProps {
  lang: 'en' | 'bn'
  t: (en: string, bn: string) => string
  chats: AiTutorChat[]
  activeChat: AiTutorChat | null
  messages: AiTutorMessage[]
  messagesLoading: boolean
  streamingText: string
  isStreaming: boolean
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onSendMessage: (content: string) => void
}

export default function TutorPage({
  lang, t, chats, activeChat, messages, messagesLoading,
  streamingText, isStreaming, onNewChat, onSelectChat, onSendMessage,
}: TutorPageProps) {
  const [input, setInput] = useState('')
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingText])

  // Focus input on mount and after sending
  useEffect(() => {
    textareaRef.current?.focus()
  }, [activeChat?.id])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return
    onSendMessage(trimmed)
    setInput('')
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [input, isStreaming, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize up to 4 lines (~96px)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    setMobileHistoryOpen(false)
  }

  const hasMessages = messages.length > 0 || isStreaming

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen relative overflow-hidden">
      {/* ── Mobile overlay backdrop ── */}
      {mobileHistoryOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileHistoryOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={-1}
          aria-label="Close history"
        />
      )}

      {/* ── Left panel: Chat history ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border transform transition-transform duration-300 ease-out
          lg:relative lg:translate-x-0 lg:z-0
          ${mobileHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ChatHistory
          chats={chats}
          activeChatId={activeChat?.id ?? null}
          lang={lang}
          t={t}
          onNewChat={onNewChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* ── Right panel: Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Top bar (mobile history toggle + chat title) */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setMobileHistoryOpen(!mobileHistoryOpen)}
          >
            {mobileHistoryOpen ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {activeChat ? activeChat.title : t('New Chat', 'নতুন চ্যাট')}
            </p>
          </div>
        </div>

        {/* Messages / Welcome */}
        {!hasMessages && !messagesLoading ? (
          <WelcomeScreen lang={lang} t={t} onSendMessage={onSendMessage} />
        ) : (
          <div className="flex-1 overflow-y-auto chat-scroll px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-5">
              {messagesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))
              )}

              {/* Streaming assistant message */}
              {isStreaming && streamingText && (
                <ChatMessage role="assistant" content={streamingText} isStreaming />
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* ── Input area ── */}
        <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-sm px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t(
                  'Ask anything about Physics or Chemistry...',
                  'পদার্থবিজ্ঞান বা রসায়ন সম্পর্কে যেকোনো প্রশ্ন করুন...',
                )}
                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-3
                  text-sm text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50
                  transition-all duration-200"
              />
            </div>
            <Button
              size="icon"
              disabled={!input.trim() || isStreaming}
              onClick={handleSend}
              className="h-10 w-10 rounded-xl flex-shrink-0 transition-transform duration-150
                hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground/60 mt-2">
            {t(
              'Press Enter to send, Shift+Enter for new line',
              'পাঠাতে Enter চাপুন, নতুন লাইনের জন্য Shift+Enter',
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
