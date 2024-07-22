import { BsStar, BsStarFill } from 'react-icons/bs';

export default function Star({
  rate,
  total = 5,
  displayEmptyStar = false,
}: {
  rate: number;
  total?: number;
  displayEmptyStar?: boolean;
}) {
  return (
    <span className='flex items-end text-[#22C064]'>
      {Math.round((rate / total) * total) > 0 &&
        Array(Math.round((rate / total) * total))
          .fill(null)
          .map((_, index) => <BsStarFill key={index} />)}
      {displayEmptyStar &&
        total - Math.round((rate / total) * total) > 0 &&
        Array(total - Math.round((rate / total) * total))
          .fill(null)
          .map((_, index) => <BsStar key={index} />)}
    </span>
  );
}
