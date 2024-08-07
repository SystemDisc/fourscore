import Star from '@/components/atoms/star';
import LinkWithBackDetection from '../molecules/link-with-back-detection';

const AnswerItem = ({
  title,
  score,
  candidateId,
  categoryId,
  answerCount,
}: {
  title: string;
  score?: number;
  candidateId: string;
  categoryId: string;
  answerCount: number;
}) => {
  return (
    <LinkWithBackDetection
      className='border border-neutral-300 rounded-md shadow hover:brightness-75 focus:outline focus:outline-[#22C064] focus:outline-offset-4 flex items-center content-center'
      href={`${candidateId}/category/${categoryId}`}
    >
      <div className='w-full text-left p-2'>
        <div className='flex flex-row justify-between gap-2 items-center'>
          <div className='grid grid-cols-1 grid-rows-1 gap-0.5'>
            <div className='font-light leading-[1.125]'>{title}</div>
            <div className='text-xs text-neutral-400 font-bold leading-none'>{answerCount} answers</div>
            {score !== undefined && !isNaN(score) && (
              <div className='flex flex-col justify-center leading-none gap-0.5'>
                <div className='font-light'>
                  <span>Four Score: </span>
                  <span>{Math.round(score)}%</span>
                </div>
                <Star
                  rate={Math.round(score / 20)}
                  displayEmptyStar
                />
              </div>
            )}
          </div>
          <div>
            <svg
              width='22'
              height='35'
              viewBox='0 0 22 35'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <mask
                id='mask0_0_2061'
                style={{ maskType: 'luminance' }}
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='22'
                height='34'
              >
                <rect
                  width='33.0912'
                  height='21'
                  transform='matrix(0 1 1 0 0.334473 0.5)'
                  fill='white'
                />
              </mask>
              <g mask='url(#mask0_0_2061)'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2.76405 5.92669C1.983 5.14564 1.983 3.87931 2.76404 3.09826L3.94256 1.91975C4.72361 1.1387 5.98993 1.1387 6.77098 1.91975L18.688 13.8367C18.7331 13.8746 18.777 13.9147 18.8195 13.9572L19.998 15.1357C20.1206 15.2583 20.224 15.393 20.3082 15.5358C20.7788 16.3059 20.6809 17.3254 20.0146 17.9918L18.8361 19.1703C18.7505 19.2558 18.6592 19.332 18.5633 19.3988L6.75438 31.2077C5.97333 31.9888 4.707 31.9888 3.92595 31.2077L2.74744 30.0292C1.96639 29.2481 1.96639 27.9818 2.74744 27.2008L13.3928 16.5554L2.76405 5.92669Z'
                  fill='#C6C9CF'
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </LinkWithBackDetection>
  );
};

export default AnswerItem;
