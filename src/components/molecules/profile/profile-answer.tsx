import AnswerItem from '@/components/atoms/answer-item';
import { CategoryWithQuestionsAndScore } from '@/types';

export default function ProfileAnswer({
  candidateId,
  category,
}: {
  candidateId: string;
  category: CategoryWithQuestionsAndScore;
}) {
  return (
    <div className='flex flex-col justify-between gap-6 hover:cursor-pointer'>
      <AnswerItem
        title={category.name}
        score={category.similarityScore}
        candidateId={candidateId}
        categoryId={category.id}
      />
    </div>
  );
}
