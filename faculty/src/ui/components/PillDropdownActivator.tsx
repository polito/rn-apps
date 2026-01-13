import { DropdownActivator } from './DropdownActivator';
import { PillButton, PillButtonProps } from './PillButton';

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
