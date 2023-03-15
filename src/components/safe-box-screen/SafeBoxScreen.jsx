import React from 'react';
import './SafeBoxScreen.scss';

const SafeBoxScreen = props => {
  const { lock, status, password, idle } = props;
  return (
    <div className={!idle ? 'sb--screen' : 'sb--screen sb--screen--idle'}>
      <p className="sb--screen--lock">{!lock ? 'Unlocked' : 'Locked'}</p>
      <p className="sb--screen--state">{!password.length ? status : password}</p>
    </div>
  );
};

export default SafeBoxScreen;
