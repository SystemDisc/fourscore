'use client';

import { useEffect, useState } from 'react';
import ToggleSwitch from '../atoms/toggle-switch';

export default function PledgeToggle({
  checked: checkedProp,
  onToggle,
}: {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(checkedProp);

  useEffect(() => {
    setChecked(checkedProp || false);
  }, [checkedProp]);

  return (
    <ToggleSwitch
      checked={checked}
      onClick={() => {
        setChecked(!checked);
        onToggle?.(!checked);
      }}
    />
  );
}
