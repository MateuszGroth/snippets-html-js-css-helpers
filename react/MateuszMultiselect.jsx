import React, { useState, useEffect, useRef } from 'react';

// import ArrowIcon from '../icons/ArrowIcon';

export default function MateuszSelect(props) {
  const [selectState, setSelectState] = useState({
    open: false,
    touched: false,
  });

  const selectNode = useRef(null);

  useEffect(() => {
    if (!props.nodeRef) {
      return;
    }
    props.nodeRef.current = selectNode.current;
    return () => {
      props.nodeRef(null);
    };
  }, []);

  const [selectWidth, setSelectWidth] = useState(null);

  useEffect(() => {
    const selectDomEl = selectNode.current;

    if (selectDomEl == null) {
      return;
    }

    const hideSelectOptions = (evt) => {
      if (selectDomEl.closest('.mateusz-select').contains(evt.target)) {
        return;
      }

      setSelectState((prevState) => ({
        ...prevState,
        open: false,
      }));
    };

    window.addEventListener('click', hideSelectOptions);
    return () => {
      window.removeEventListener('click', hideSelectOptions);
    };
  }, [selectNode]);

  useEffect(() => {
    if (props.isSized) {
      return;
    }

    const selectDomEl = selectNode.current;

    if (selectDomEl == null) {
      return;
    }

    const { width } = selectDomEl.getBoundingClientRect();
    if (!isNaN(width)) {
      setSelectWidth(Math.round(width));
    }
  }, [selectNode]);

  const disabled =
    !!props.disabled || props.options == null || props.options.length === 0;

  const handleSelectedContClick = () => {
    if (disabled) return;

    setSelectState((prevState) => ({
      ...prevState,
      open: !prevState.open,
      touched: true,
    }));
  };

  const handleOptionClick = (optionValue) => (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setSelectState({
      open: false,
      touched: true,
    });

    if (selectNode.current) selectNode.current.focus();

    props.onChange && props.onChange(optionValue);
  };

  const selectProps = { className: 'mateusz-select__value' };
  Object.entries(props).forEach(([key, value]) => {
    if (
      [
        'options',
        'helperText',
        'className',
        'messageVisible',
        'selectedOptions',
        'errorMessage',
        'ref',
        'nodeRef',
        'disabled',
        'isSized',
        'onFocus',
        'onBlur',
        'onChange',
      ].includes(key)
    ) {
      return;
    }

    if (key === 'selectClassName') {
      selectProps['className'] += ' ' + value;
      return;
    }

    if (typeof value === 'function') {
      selectProps[key] = value;
      return;
    }

    selectProps[key] = '' + value;
  });

  selectProps.onClick = handleSelectedContClick;

  const valid = props.valid == null ? true : props.valid;

  let className = `mateusz-select mateusz-select--multi`;

  if (props.className) className += ` ${props.className}`;

  if (disabled) {
    className += ' mateusz-select--disabled';
    selectProps.disabled = true;
  }

  if (selectState.open) className += ' mateusz-select--open';

  if (!valid) className += ' mateusz-select--invalid';
  else if (props.showValid && valid) className += ' mateusz-select--valid';

  const style = {};

  if (!props.isSized && selectWidth != null) {
    style['--select-width'] = `${selectWidth}px`;
  }

  return (
    <div className={className} style={style}>
      <div className="mateusz-select__text-field">
        <div tabIndex="0" ref={selectNode} {...selectProps}></div>
        <label>{selectProps.label || ''}</label>
        {/* <ArrowIcon /> */}
      </div>

      {!valid && !disabled && props.errorMessage ? (
        <div className="mateusz-select__msg-wrap">
          <span className="mateusz-select__error-msg">
            {props.errorMessage}
          </span>
        </div>
      ) : props.helperText ? (
        <div className="mateusz-select__msg-wrap">
          <span className="mateusz-select__helper-txt">{props.helperText}</span>
        </div>
      ) : (
        ''
      )}

      <div className={`mateusz-select__options`}>
        {props.options.map((option) => (
          <span
            key={option.value}
            onClick={handleOptionClick(option.value)}
            className={`mateusz-select__option${
              selectState.value === option.value
                ? ' mateusz-select__option--selected'
                : ''
            }`}
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
