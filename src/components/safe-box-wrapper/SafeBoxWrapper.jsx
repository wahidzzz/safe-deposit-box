import React, { useEffect } from 'react';
import './SafeBoxWrapper.scss';
import { useDispatch, useSelector } from 'react-redux';
import SafeBoxScreen from '../safe-box-screen/SafeBoxScreen';
import { addKeyAction, goIdleAction, goToServiceModeAction, locking, unlocking, validateMasterCode } from '../../app/redux/safeBoxSlice';
import keypads from '../../app/consts/keypads';
import SafeBoxKey from '../safe-box-key/SafeBoxKey';
import globals from '../../app/consts/conf';

const SafeBoxWrapper = () => {
  const dispatch = useDispatch();
  const { lock, status, password, idle, loading, sn, serviceMode, savedPassword } = useSelector(state => state.depositBox);

  useEffect(() => {
    const handleKeyBoardInputs = event => {
      const key = event.key.toUpperCase();
      if (keypads.toString().indexOf(key) !== -1) {
        addKey(key);
      }
    };
    document.addEventListener('keydown', handleKeyBoardInputs);
    return () => document.removeEventListener('keydown', handleKeyBoardInputs);
  }, []);

  const addKey = key => {
    if (loading) return;

    if (!serviceMode && !isNaN(key)) {
      dispatch(addKeyAction(key));
    } else if (serviceMode) {
      dispatch(addKeyAction(key));
    }

    clearTimeout(inputSubmit);

    if (!serviceMode && key === 'L') {
      keySubmit();
      checkServiceMode();
    } else {
      inputSubmit = setTimeout(() => {
        checkServiceMode();
        keySubmit();
        validateMasterCode();
      }, globals.inputDelayTimeout);
    }
  };

  let inputSubmit = null;

  const keySubmit = () => {
    if (!serviceMode && password.length === 6) {
      if (!lock) {
        dispatch(locking(password));
      } else {
        dispatch(unlocking({ savedPassword, password }));
      }
    }
  };

  const checkServiceMode = () => {
    if (lock && !serviceMode && password.length === 6 && password === '000000') {
      dispatch(goToServiceModeAction());
    }
  };

  const validateMasterCode = () => {
    if (lock && serviceMode && password.length >= 12) {
      const areUnique = [...new Set(password.split(''))];
      if (areUnique.length === 12) {
        dispatch(validateMasterCode({ password, sn }));
      }
    }
  };

  const checkIdleState = () => {
    clearTimeout(sceenLightOff);
    sceenLightOff = setTimeout(() => {
      dispatch(goIdleAction());
    }, globals.screenLightTimeout);
  };

  let sceenLightOff = null;

  if (!idle) {
    checkIdleState();
  }

  return (
    <div className="sb--wrapper">
      <SafeBoxScreen lock={lock} status={status} password={password} idle={idle} />
      <div className="sb--wrapper--keyboard">
        {keypads.map((item, index) => (
          <SafeBoxKey key={index} padKey={item} disabled={loading} keyAction={addKey} />
        ))}
      </div>
      <p className="sb--wrapper--serial-number">S/N: {sn}</p>
    </div>
  );
};

export default SafeBoxWrapper;
