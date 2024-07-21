import AnswerItem from '@/components/atoms/answer-item';
import { CategoryWithQuestionsAndScore } from '@/types';

export default function ProfileAnswer({
  candidateId,
  data,
}: {
  candidateId: string;
  data: CategoryWithQuestionsAndScore;
}) {
  return (
    <div className='flex flex-col justify-between gap-6 hover:cursor-pointer'>
      <AnswerItem
        title={data.name}
        score={data.similarityScore}
        candidateId={candidateId}
        categoryId={data.id}
      />
    </div>
  );
}
