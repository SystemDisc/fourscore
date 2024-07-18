import { HTMLAttributes } from 'react';

export default function Star({
    rate,
    total = 5,
    displayEmptyStar = false,
}: {
    rate: number
    total?: number
    displayEmptyStar?: boolean
}) {
// rating should be a number between 0 and 5
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < total; i++) {
      if (i < rate)
        stars.push(<span className="text-xl text-[#69F7A5]" key={i}>★</span>);
      else if (displayEmptyStar)
        stars.push(<span className="text-xl text-[#212224]" key={i}>★</span>);
    }
    return stars;
  };
  return (
    <div className='flex flex-row gap-1'>
        {renderStars()}
    </div>
  );
}