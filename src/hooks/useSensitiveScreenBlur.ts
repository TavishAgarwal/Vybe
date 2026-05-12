import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const useSensitiveScreenBlur = () => {
  const [shouldBlur, setShouldBlur] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setShouldBlur(state !== 'active');
    });

    return () => subscription.remove();
  }, []);

  return shouldBlur;
};
