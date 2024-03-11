'use client';

import classNames from 'classnames';
import { HTMLAttributes, InputHTMLAttributes, useState } from 'react';

export default function ToggleSwitch({
  checked,
  ...props
}: {
  checked?: boolean,
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames('w-12 h-20 border border-neutral-300 rounded-full shadow-[#000_0px_2px_2px] overflow-hidden cursor-pointer relative transition-all', {
      'bg-gradient-to-tr from-[#22C064] to-[#69F7A5]': checked,
      'bg-gradient-to-tr from-neutral-100 to-neutral-100': !checked,
    })} {...props}>
      <div className={classNames('absolute w-11 h-11 border border-neutral-300 rounded-full bg-white shadow-[#000_0px_2px_2px] left-[0.0625rem] transition-all', {
        'top-[0.0625rem]': checked,
        'top-[1.9375rem]': !checked,
      })}></div>
    </div>
  );
}
