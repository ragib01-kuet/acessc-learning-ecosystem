import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../blink/client'
import type { AiTutorChat, AiTutorMessage } from '../types'

const TUTOR_SYSTEM_PROMPT = `You are AceSSC AI Tutor, an expert SSC (Secondary School Certificate) Physics and Chemistry tutor for Bangladeshi students.

Your responsibilities:
- Explain scientific concepts in simple, clear terms
- Provide step-by-step solutions to problems
- Give examples relevant to Bangladeshi students' daily life
- Support both English and Bangla — respond in the same language the student uses
- If the student writes in Bangla, respond in Bangla
- Use proper scientific notation and formulas
- Be encouraging and patient
- Break down complex topics into digestible parts
- Provide memory tricks (mnemonics) when helpful
- Reference SSC textbook chapters when relevant

Format your responses with clear headings, bullet points, and step-by-step explanations. Use markdown formatting.`

export function useAiTutorChats(userId?: string) {
  return useQuery({
    queryKey: ['tutorChats', userId],
    queryFn: async () => {
      const data = await blink.db.aiTutorChats.list({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        limit: 20,
      })
      return data as AiTutorChat[]
    },
    enabled: !!userId,
  })
}

export function useAiTutorMessages(chatId?: string) {
  return useQuery({
    queryKey: ['tutorMessages', chatId],
    queryFn: async () => {
      const data = await blink.db.aiTutorMessages.list({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
        limit: 100,
      })
      return data as AiTutorMessage[]
    },
    enabled: !!chatId,
  })
}

export function useCreateTutorChat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      userId: string
      title?: string
      subject?: string
      chapterId?: string
    }) => {
      return blink.db.aiTutorChats.create({
        userId: params.userId,
        title: params.title || 'New Chat',
        subject: params.subject || '',
        chapterId: params.chapterId || '',
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutorChats', variables.userId] })
    },
  })
}

export function useAiTutorStream() {
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const queryClient = useQueryClient()

  const sendMessage = useCallback(
    async (params: {
      chatId: string
      userId: string
      content: string
      previousMessages: AiTutorMessage[]
    }) => {
      const { chatId, userId, content, previousMessages } = params

      // Save user message
      await blink.db.aiTutorMessages.create({
        chatId,
        userId,
        role: 'user',
        content,
      })

      // Build messages array for AI
      const messages: Array<{
        role: 'system' | 'user' | 'assistant'
        content: string
      }> = [
        { role: 'system', content: TUTOR_SYSTEM_PROMPT },
        ...previousMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content },
      ]

      // Stream AI response
      setIsStreaming(true)
      setStreamingText('')
      let fullText = ''

      try {
        await blink.ai.streamText({ messages }, (chunk: string) => {
          fullText += chunk
          setStreamingText(fullText)
        })

        // Save assistant message
        await blink.db.aiTutorMessages.create({
          chatId,
          userId,
          role: 'assistant',
          content: fullText,
        })

        // Update chat title if first message
        if (previousMessages.length === 0) {
          const title =
            content.length > 40 ? content.substring(0, 40) + '...' : content
          await blink.db.aiTutorChats.update(chatId, {
            title,
            updatedAt: new Date().toISOString(),
          })
          queryClient.invalidateQueries({ queryKey: ['tutorChats', userId] })
        }

        queryClient.invalidateQueries({ queryKey: ['tutorMessages', chatId] })
      } catch (error) {
        console.error('AI Tutor stream error:', error)
        throw error
      } finally {
        setIsStreaming(false)
        setStreamingText('')
      }
    },
    [queryClient]
  )

  return { sendMessage, streamingText, isStreaming }
}
