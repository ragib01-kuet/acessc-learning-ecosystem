import { blink } from '../blink/client'
import { syllabusCatalog } from './syllabusCatalog'

function createTopicContent(subjectName: string, chapterTitle: string, part: number) {
  const headingEn = part === 1 ? 'Core Concepts' : 'Practice Focus'
  const headingBn = part === 1 ? 'মূল ধারণা' : 'অনুশীলন ফোকাস'

  return {
    title: part === 1 ? `${chapterTitle} Fundamentals` : `${chapterTitle} Application`,
    titleBn: part === 1 ? `${chapterTitle} মৌলিক ধারণা` : `${chapterTitle} প্রয়োগ`,
    contentEn: `
      <h2>${headingEn}</h2>
      <p>This lesson introduces the most important ideas from <strong>${chapterTitle}</strong> in ${subjectName}. Focus on definitions, formulas, and real exam patterns.</p>
      <ul>
        <li>Understand the chapter's key terms and rules.</li>
        <li>Connect formulas with textbook examples.</li>
        <li>Review common SSC-style mistakes before practice.</li>
      </ul>
      <blockquote>Tip: Study the concept first, then solve a few structured questions immediately.</blockquote>
    `,
    contentBn: `
      <h2>${headingBn}</h2>
      <p><strong>${chapterTitle}</strong> অধ্যায়ের সবচেয়ে গুরুত্বপূর্ণ ধারণাগুলো এখানে সংক্ষেপে সাজানো হয়েছে। সংজ্ঞা, সূত্র এবং SSC পরীক্ষার ধরণে গুরুত্ব দাও।</p>
      <ul>
        <li>অধ্যায়ের মূল শব্দ ও নিয়ম বুঝে নাও।</li>
        <li>সূত্রগুলোকে উদাহরণের সাথে মিলিয়ে পড়ো।</li>
        <li>অনুশীলনের আগে সাধারণ ভুলগুলো দেখে নাও।</li>
      </ul>
      <blockquote>পরামর্শ: আগে ধারণা বুঝো, তারপর সাথে সাথে কিছু প্রশ্ন সমাধান করো।</blockquote>
    `,
  }
}

export async function ensureSyllabusSeeded() {
  const existingSubjects = await blink.db.subjects.list({ limit: 1 })
  if ((existingSubjects as unknown[]).length > 0) return

  for (const [subjectIndex, subject] of syllabusCatalog.entries()) {
    const createdSubject = await blink.db.subjects.create({
      name: subject.name,
      nameBn: subject.nameBn,
      icon: subject.icon,
      totalChapters: subject.chapters.length,
      orderIndex: subjectIndex + 1,
    })

    for (const [chapterIndex, chapter] of subject.chapters.entries()) {
      const createdChapter = await blink.db.chapters.create({
        subjectId: createdSubject.id,
        title: chapter.title,
        titleBn: chapter.titleBn,
        orderIndex: chapterIndex + 1,
        totalTopics: 2,
      })

      const topicOne = createTopicContent(subject.name, chapter.title, 1)
      const topicTwo = createTopicContent(subject.name, chapter.title, 2)

      await blink.db.topics.createMany([
        {
          chapterId: createdChapter.id,
          title: topicOne.title,
          titleBn: topicOne.titleBn,
          contentEn: topicOne.contentEn,
          contentBn: topicOne.contentBn,
          orderIndex: 1,
        },
        {
          chapterId: createdChapter.id,
          title: topicTwo.title,
          titleBn: topicTwo.titleBn,
          contentEn: topicTwo.contentEn,
          contentBn: topicTwo.contentBn,
          orderIndex: 2,
        },
      ])
    }
  }
}
