import { PillButton, PillButtonProps } from './PillButton';

import { DropdownActivator } from './DropdownActivator';
import React from 'react';

export type PillDropdownActivatorProps = PillButtonProps;

export const PillDropdownActivator = ({
  children,
  ...props
}: PillDropdownActivatorProps) => {
  return (
    <PillButton {...props}>
      <DropdownActivator>{children}</DropdownActivator>
    </PillButton>
  );
};