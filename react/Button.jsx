import React, { useState, useRef } from 'react';

export default function CustomButton(props) {
  const [clickDetails, setClickDetails] = useState({
    active: false,
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const buttonNode = useRef(null);

  // useEffect(() => () => setNodeButton(null), []);

  const onMouseDown = (evt) => {
    const tmpX = evt.clientX;
    const tmpY = evt.clientY;
    const buttonDomEl = buttonNode.current;

    if (tmpX == null || tmpY == null || buttonDomEl == null) {
      return;
    }

    setClickDetails((prevState) => ({ ...prevState, active: false }));
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
      setClickDetails({
        active: true,
        x: Math.round(tmpX - nodeX),
        y: Math.round(tmpY - nodeY),
        height,
        width,
      });
    }, 10);
  };

  const className = `custom-button__rounded${
    props.className ? ` ${props.className}` : ''
  }${clickDetails.active ? ' button--active' : ''}`;

  const style = {
    ...(props.style || {}),
    '--x': clickDetails.x,
    '--y': clickDetails.y,
    '--size':
      clickDetails.width > clickDetails.height
        ? clickDetails.width
        : clickDetails.height,
  };

  const buttonProps = { ...props, className, style, onMouseDown };
  return (
    <button ref={buttonNode} {...buttonProps}>
      {props.children || ``}
    </button>
  );
}
