export interface SyllabusChapter {
  title: string
  titleBn: string
}

export interface SyllabusSubject {
  name: string
  nameBn: string
  icon: string
  chapters: SyllabusChapter[]
}

export const syllabusCatalog: SyllabusSubject[] = [
  {
    name: 'Physics',
    nameBn: 'পদার্থবিজ্ঞান',
    icon: 'atom',
    chapters: [
      { title: 'Physical Quantities', titleBn: 'ভৌত রাশি ও পরিমাপ' },
      { title: 'Motion', titleBn: 'গতি' },
      { title: 'Force', titleBn: 'বল' },
      { title: 'Work and Energy', titleBn: 'কাজ ও শক্তি' },
      { title: 'Power', titleBn: 'ক্ষমতা' },
      { title: 'Simple Machines', titleBn: 'সরল যন্ত্র' },
      { title: 'States of Matter', titleBn: 'পদার্থের অবস্থা' },
      { title: 'Pressure', titleBn: 'চাপ' },
      { title: 'Heat', titleBn: 'তাপ' },
      { title: 'Waves', titleBn: 'তরঙ্গ' },
      { title: 'Light', titleBn: 'আলো' },
      { title: 'Electricity', titleBn: 'বিদ্যুৎ' },
      { title: 'Modern Physics', titleBn: 'আধুনিক পদার্থবিজ্ঞান' },
    ],
  },
  {
    name: 'Chemistry',
    nameBn: 'রসায়ন',
    icon: 'flask-conical',
    chapters: [
      { title: 'Concepts of Chemistry', titleBn: 'রসায়নের ধারণা' },
      { title: 'Structure of Atom', titleBn: 'পরমাণুর গঠন' },
      { title: 'Periodic Table', titleBn: 'পর্যায় সারণি' },
      { title: 'Chemical Bonding', titleBn: 'রাসায়নিক বন্ধন' },
      { title: 'States of Matter', titleBn: 'পদার্থের অবস্থা' },
      { title: 'Chemical Reactions', titleBn: 'রাসায়নিক বিক্রিয়া' },
      { title: 'Acids and Bases', titleBn: 'অম্ল ও ক্ষার' },
      { title: 'Salts', titleBn: 'লবণ' },
      { title: 'Metals', titleBn: 'ধাতু' },
      { title: 'Organic Chemistry', titleBn: 'জৈব রসায়ন' },
      { title: 'Environmental Chemistry', titleBn: 'পরিবেশ রসায়ন' },
    ],
  },
]
