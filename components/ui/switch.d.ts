import * as React from 'react';

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.ForwardRefExoticComponent<
  SwitchProps & React.RefAttributes<HTMLDivElement>
>;
