import classNames from 'classnames';
import { BsStar, BsStarFill } from 'react-icons/bs';

export default function Star({
  rate,
  total = 5,
  displayEmptyStar = false,
  unknown = false,
}: {
  rate: number;
  total?: number;
  displayEmptyStar?: boolean;
  unknown?: boolean;
}) {
  return (
    <span className='flex items-end text-[#22C064] relative'>
      {Math.round((rate / total) * total) > 0 &&
        Array(Math.round((rate / total) * total))
          .fill(null)
          .map((_, index) => <BsStarFill key={index} />)}
      {displayEmptyStar &&
        total - Math.round((rate / total) * total) > 0 &&
        Array(total - Math.round((rate / total) * total))
          .fill(null)
          .map((_, index) => (
            <>
              <BsStar
                className={classNames({
                  'opacity-50': unknown,
                })}
                key={index}
              />
              {unknown && (
                <span
                  className='absolute font-black text-[8px] top-[3px]'
                  style={{
                    left: `${6 + 16 * index}px`,
                  }}
                >
                  ?
                </span>
              )}
            </>
          ))}
    </span>
  );
}
