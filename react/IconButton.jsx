import React, { useState, useRef, useEffect } from 'react';

export default function IconButton(props) {
  const [clickDetails, setButtonDetails] = useState({
    clicked: false,
    focused: false,
    hover: false,
    x: 0,
    y: 0,
  });

  const buttonRef = useRef(null);

  const onMouseDown = function (evt) {
    const tmpX = evt.clientX;
    const tmpY = evt.clientY;
    const buttonDomEl = buttonRef.current;

    if (tmpX == null || tmpY == null || buttonDomEl == null) {
      return;
    }
    setButtonDetails((prevState) => ({ ...prevState, clicked: false }));
    setTimeout(() => {
      if (buttonDomEl == null) {
        return;
      }
      const {
        x: nodeX,
        y: nodeY,
        height,
        width,
      } = buttonDomEl.getBoundingClientRect();

      if (!height && !width) {
        return;
      }
      setButtonDetails({
        clicked: true,
        x: Math.round(tmpX - nodeX),
        y: Math.round(tmpY - nodeY),
      });
    }, 10);

    props.onMouseDown && props.onMouseDown.bind(this)(evt);
  };

  const onClick = function (evt) {
    if (props.disabled) {
      return;
    }
    setButtonDetails((prevState) => ({
      ...prevState,
      focus: false,
    }));

    props.onClick && props.onClick.bind(this)(evt);
  };

  let className = `icon-button`;

  if (props.className) className += ` ${props.className}`;
  if (props.active) className += ` icon-button--active`;
  if (props.disabled) className += ` icon-button--disabled`;
  if (clickDetails.focused) className += ` icon-button--focus`;
  if (clickDetails.hover) className += ` icon-button--hover`;
  if (clickDetails.clicked) className += ` icon-button--clicked`;

  const onFocus = () => {
    setButtonDetails((prevState) => ({ ...prevState, focused: true }));
    props.onFocus && props.onFocus();
  };
  const onBlur = () => {
    setButtonDetails((prevState) => ({ ...prevState, focused: false }));
    props.onBlur && props.onBlur();
  };

  const onMouseEnter = () => {
    setButtonDetails((prevState) => ({ ...prevState, hover: true }));
    props.onMouseEnter && props.onMouseEnter();
  };
  const onMouseLeave = () => {
    setButtonDetails((prevState) => ({ ...prevState, hover: false }));
    props.onMouseLeave && props.onMouseLeave();
  };

  const ref = buttonRef;

  const style = {
    ...(props.style || {}),
    '--x': clickDetails.x,
    '--y': clickDetails.y,
  };

  const buttonProps = {
    onClick,
    className,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onMouseDown,
    ref,
    style,
  };
  Object.entries(props).forEach(([key, value]) => {
    if (
      [
        'className',
        'ref',
        'nodeRef',
        'disabled',
        'onFocus',
        'onBlur',
        'onChange',
        'onMouseLeave',
        'onMouseEnter',
      ].includes(key)
    ) {
      return;
    }

    if (typeof value === 'function') {
      buttonProps[key] = value;
      return;
    }

    if (key === 'style') {
      buttonProps[key] = value;
      return;
    }

    buttonProps[key] = '' + value;
  });

  useEffect(() => {
    if (props.ref) props.ref.current = buttonRef.current;
  }, []);

  return (
    <div tabIndex={props.disabled ? '-1' : '0'} {...buttonProps}>
      {props.children || ``}
    </div>
  );
}
