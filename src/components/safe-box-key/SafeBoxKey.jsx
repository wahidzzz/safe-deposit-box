import React from 'react';
import './SafeBoxKey.scss';

const SafeBoxKey = props => {
  const { padKey, keyAction, disabled } = props;
  const iconFinder = (padKey) => {
    return {
      2: "↓",
      4: "←",
      6: "→",
      8: "↑"

    }[padKey]
  }
  return (
    <div className={disabled ? 'sb--button sb--button--disabled' : 'sb--button'} aria-disabled={disabled} onClick={() => keyAction(padKey)}>
      <p className="sb--button--inputkey">{padKey}</p>
      <span className='sb--button--icon'>{iconFinder(padKey)}</span>
    </div>
  );
};

export default SafeBoxKey;
