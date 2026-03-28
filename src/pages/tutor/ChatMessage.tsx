/**
 * ChatMessage — Renders a single user or assistant message bubble.
 *
 * User messages are right-aligned with accent background.
 * Assistant messages are left-aligned with a bot avatar and card background.
 */
import { Bot } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end animate-message-in">
        <div className="max-w-[80%] lg:max-w-[65%] rounded-2xl rounded-br-md px-4 py-3 bg-accent text-accent-foreground shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-start animate-message-in">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
        <Bot className="h-4 w-4 text-accent" />
      </div>
      <div className="max-w-[85%] lg:max-w-[70%] rounded-2xl rounded-tl-md px-4 py-3 bg-card border border-border shadow-sm">
        <div
          className={`text-sm leading-relaxed text-card-foreground prose-sm
            [&_strong]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
            [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1.5
            [&_li]:my-0.5 [&_p]:my-1 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
            ${isStreaming ? 'streaming-cursor' : ''}`}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
        />
      </div>
    </div>
  )
}

/** Simple markdown-to-HTML for common patterns */
function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}
