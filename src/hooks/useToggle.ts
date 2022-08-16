import { useState } from 'react';

export const useToggle = (
  initialValue: boolean
): [boolean, (newValue: boolean) => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = (newValue: boolean) => {
    setValue((currentValue) =>
      typeof newValue === 'boolean' ? newValue : !currentValue
    );
  };

  return [value, toggleValue];
};
