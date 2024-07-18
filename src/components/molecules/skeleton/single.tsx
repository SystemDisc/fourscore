export function LabelSkeleton({
    len = 20,
    height = 2,
}: {
    len?: number,
    height?: number,
}) {
    return (
      <div className={len == 0 ? `animate-pulse inline-block w-full` : `animate-pulse inline-block w-[${len}px]`}>
          <div
              className={`block h-${height} mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit w-full`}>
              &nbsp;
          </div>
      </div>
    )
  }
  
export function SingleSkeleton() {
  return (
    <div className="max-w-full animate-pulse ">
        <div
            className="block w-56 h-3 mb-4 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-gray-300 rounded-full text-inherit">
            &nbsp;
        </div>
        <div
            className="block h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit w-full">
            &nbsp;
        </div>
        <div
            className="block h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit w-full">
            &nbsp;
        </div>
        <div
            className="block h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit w-full">
            &nbsp;
        </div>
        <div
            className="block h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit w-full">
            &nbsp;
        </div>
    </div>
  )
}

export default SingleSkeleton;