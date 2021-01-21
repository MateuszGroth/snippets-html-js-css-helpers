import React, { useState, useEffect, useRef } from 'react';

// import CloseIcon from '../icons/CloseIcon';

export default function MateuszInput(props) {
  const [inputState, setInputState] = useState({
    labelTop: props.labelTop || (props.value && props.value !== ''),
    focus: false,
    touched: false,
  });

  const inputNode = useRef(null);

  useEffect(() => {
    if (props.value && !inputState.labelTop) {
      setInputState((prevState) => ({ ...prevState, labelTop: true }));
    }
  }, [props.value]);

  useEffect(() => {
    if (!props.nodeRef) {
      return;
    }
    return () => {
      props.nodeRef(null);
    };
  }, []);

  const [inputWidth, setInputWidth] = useState(null);

  useEffect(() => {
    if (props.nodeRef) {
      props.nodeRef(inputNode.current);
    }

    if (props.isSized) {
      return;
    }

    const inputDomEl = inputNode.current;

    if (inputDomEl == null) {
      return;
    }

    const { width } = inputDomEl.getBoundingClientRect();
    if (isNaN(width)) {
      return;
    }
    setInputWidth(Math.round(width));
  }, [inputNode]);

  const inputProps = {};
  Object.entries(props).forEach(([key, value]) => {
    if (
      [
        'helperText',
        'className',
        'messageVisible',
        'errorMessage',
        'ref',
        'nodeRef',
        'disabled',
        'isSized',
        'onFocus',
        'onBlur',
        'onChange',
        'enableClear',
      ].includes(key)
    ) {
      return;
    }

    if (key === 'inputClassName') {
      inputProps['className'] = value;
      return;
    }

    if (typeof value === 'function') {
      inputProps[key] = value;
      return;
    }

    inputProps[key] = '' + value;
  });

  const onBlur = () => {
    setInputState((prevState) => ({
      ...prevState,
      focus: false,
      touched: false,
      labelTop: props.value !== '',
    }));

    if (props.onBlur) {
      props.onBlur();
    }
  };
  const onFocus = () => {
    setInputState((prevState) => ({
      ...prevState,
      focus: true,
      touched: true,
      labelTop: true,
    }));

    props.onFocus && props.onFocus();
  };

  const onChange = (evt) => {
    const newValue = evt.target.value;

    props.onChange && props.onChange(newValue);
  };

  inputProps.onFocus = onFocus;
  inputProps.onBlur = onBlur;
  inputProps.onChange = onChange;

  const valid = props.valid == null ? true : props.valid;
  const disabled = !!props.disabled;

  let className = `mateusz-input`;

  if (props.className) className += ` ${props.className}`;
  if (disabled) {
    className += ' mateusz-input--disabled';
    inputProps.disabled = true;
  }

  if (inputState.focus) className += ' mateusz-input--focus';

  if (!valid) className += ' mateusz-input--invalid';
  else if (props.showValid && valid) className += ' mateusz-input--valid';

  if (inputState.labelTop) className += ' mateusz-input--label-top';

  inputProps.value = props.value;

  const style = {};

  if (!props.isSized && inputWidth != null) {
    style['--input-width'] = `${inputWidth}px`;
  }

  const handleClearClick = () => {
    props.onChange('');

    if (inputNode.current) inputNode.current.focus();
  };

  return (
    <div className={className} style={style}>
      <div className="mateusz-input__text-field">
        <input ref={inputNode} {...inputProps} />

        <label>{inputProps.label || 'label'}</label>
        {/* {props.enableClear && props.value !== '' ? (
                    <div onClick={handleClearClick} className="mateusz-input__clear-wrap">
                        <CloseIcon />
                    </div>
                ) : (
                    ''
                )} */}
      </div>

      {!valid && !disabled && props.errorMessage ? (
        <div className="mateusz-input__msg-wrap">
          <span className="mateusz-input__error-msg">{props.errorMessage}</span>
        </div>
      ) : props.helperText ? (
        <div className="mateusz-input__msg-wrap">
          <span className="mateusz-input__helper-txt">{props.helperText}</span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
