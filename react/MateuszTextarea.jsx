import React, { useState, useEffect, useRef } from 'react';

export default function MateuszTextarea(props) {
  const [textareaState, setTextareaState] = useState({
    labelTop: props.value && props.value !== '',
    focus: false,
    touched: false,
  });
  const textareaNode = useRef(null);

  useEffect(() => {
    if (props.value && !textareaState.labelTop) {
      setTextareaState((prevState) => ({ ...prevState, labelTop: true }));
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

  const [textareaWidth, setTextareaWidth] = useState(null);

  useEffect(() => {
    if (props.nodeRef) {
      props.nodeRef(textareaNode.current);
    }

    if (props.isSized) {
      return;
    }

    const textareaDomEl = textareaNode.current;

    if (textareaDomEl == null) {
      return;
    }

    const { width } = textareaDomEl.getBoundingClientRect();
    if (isNaN(width)) {
      return;
    }
    setTextareaWidth(Math.round(width));
  }, [textareaNode]);

  const textareaProps = {};
  Object.entries(props).forEach(([key, value]) => {
    if (
      [
        'helperText',
        'className',
        'messageVisible',
        'errorMessage',
        'ref',
        'disabled',
        'nodeRef',
        'onFocus',
        'onBlur',
        'onChange',
        'isSized',
        'style',
      ].includes(key)
    ) {
      return;
    }

    if (key === 'inputClassName') {
      textareaProps['className'] = value;
      return;
    }

    if (typeof value === 'function') {
      textareaProps[key] = value;
      return;
    }

    textareaProps[key] = '' + value;
  });

  const onBlur = () => {
    setTextareaState((prevState) => ({
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
    setTextareaState((prevState) => ({
      ...prevState,
      focus: true,
      touched: true,
      labelTop: true,
    }));

    props.onFocus && props.onFocus();
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const onChange = (evt) => {
    const newValue = evt.target.value;

    props.onChange && props.onChange(newValue);
  };

  textareaProps.onFocus = onFocus;
  textareaProps.onBlur = onBlur;
  textareaProps.onChange = onChange;

  const valid = props.valid == null ? true : props.valid;
  const disabled = !!props.disabled;

  let className = `mateusz-textarea`;

  if (disabled) {
    className += ' mateusz-textarea--disabled';
    textareaProps.disabled = true;
  }

  if (props.className) className += ` ${props.className}`;

  if (textareaState.focus) className += ' mateusz-textarea--focus';

  if (!valid) className += ' mateusz-textarea--invalid';
  else if (props.showValid && valid) className += ' mateusz-textarea--valid';

  if (textareaState.labelTop) className += ' mateusz-textarea--label-top';

  if (disabled) className += ' mateusz-textarea--disabled';

  textareaProps.value = props.value;

  const style = { ...(props.style ? props.style : {}) };

  if (!props.isSized && textareaWidth != null) {
    style['--textarea-width'] = `${textareaWidth}px`;
  }

  return (
    <div className={className} style={style}>
      <div className="mateusz-textarea__text-field">
        <textarea ref={textareaNode} {...textareaProps}></textarea>

        <label>{textareaProps.label || 'label'}</label>
      </div>

      {!valid && props.errorMessage ? (
        <div className="mateusz-textarea__msg-wrap">
          <span className="mateusz-textarea__error-msg">
            {props.errorMessage}
          </span>
        </div>
      ) : props.helperText ? (
        <div className="mateusz-textarea__msg-wrap">
          <span className="mateusz-textarea__helper-txt">
            {props.helperText}
          </span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
