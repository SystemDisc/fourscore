import AnswerItem from '@/components/atoms/answer-item';

export default function ProfileAnswer({
  data
}: {
  data: {
    similarityScore: number;
    name: string | null;
    categoryId: string;
    totalQuestions: string | number | bigint;
    answeredQuestions: string | number | bigint | null;
  }
}) {
  return (
    <div className='flex flex-col justify-between gap-6 hover:cursor-pointer'>
        <AnswerItem title={data.name} score={data.similarityScore} categoryId={data.categoryId}/>
    </div>
  );
}
