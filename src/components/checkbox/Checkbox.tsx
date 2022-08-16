import React from 'react';
import { BsCheckSquare, BsCheckSquareFill } from 'react-icons/bs';
import { CheckboxProps } from 'types';

const Checkbox = (props: CheckboxProps) => {
  const ActiveIcon = props.ActiveIcon || BsCheckSquareFill;
  const InactiveIcon = props.InactiveIcon || BsCheckSquare;

  const handleClick = () => {
    props.onChange(!props.checked);
  };

  return props.checked === true ? (
    <ActiveIcon
      style={props.style ? props.style : {}}
      color={props.color}
      onClick={handleClick}
      size={props.size}
      className={`cursor-pointer ${props?.className || ''}`}
    />
  ) : (
    <InactiveIcon
      style={props.style ? props.style : {}}
      color={props.color}
      onClick={handleClick}
      size={props.size}
      className={`cursor-pointer ${props?.className || ''}`}
    />
  );
};

Checkbox.defaultProps = {
  onChange: () =>
    console.log('Please attach an onChange function to [Checkbox]'),
  checked: false,
  className: '',
};

export default Checkbox;
