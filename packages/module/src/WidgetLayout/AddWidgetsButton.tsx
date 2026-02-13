import { Button, ButtonProps } from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import React from 'react';

export interface AddWidgetsButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Callback when the button is clicked */
  onClick: () => void;
}

const AddWidgetsButton: React.FunctionComponent<AddWidgetsButtonProps> = ({
  onClick,
  children = 'Add widgets',
  variant = 'secondary',
  icon = <PlusCircleIcon />,
  ...rest
}) => (
  <Button
    variant={variant}
    onClick={onClick}
    icon={icon}
    {...rest}
  >
    {children}
  </Button>
);

export default AddWidgetsButton;
