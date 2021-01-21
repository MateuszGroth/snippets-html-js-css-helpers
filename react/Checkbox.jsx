import React, { useState } from 'react';

let checkIndex = 0;

export default function CustomCheckbox(props) {
  ++checkIndex;
  const [checked, setChecked] = useState(props.checked);

  const handleOnChange = (evt) => {
    const newValue = !checked;
    setChecked(newValue);

    if (!props.onChange) {
      return;
    }
    props.onChange(newValue);
  };

  return (
    <div
      className={`custom-checkbox__wrap${
        props.className ? ` ${props.className}` : ''
      }
      ${!!props.disabled ? ' custom-checkbox--disabled' : ''}`}
    >
      <input
        id={`customCheckbox_${props.id}_${checkIndex}`}
        type="checkbox"
        checked={checked}
        onChange={handleOnChange}
        disabled={!!props.disabled}
      />
      <label htmlFor={`customCheckbox_${props.id}_${checkIndex}`}>
        {props.label}
      </label>
    </div>
  );
}
