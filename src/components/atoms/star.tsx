import { HTMLAttributes } from 'react';

export default function Star({
    rate
}: {
    rate: number
}) {
// rating should be a number between 0 and 5
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < rate; i++) {
      stars.push(
        <span className="text-xl text-[#69F7A5]" key={i}>★</span>
      );
    }
    return stars;
  };
  return (
    <div className='flex flex-row gap-1'>
        {renderStars()}
    </div>
  );
}