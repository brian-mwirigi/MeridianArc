import { useState } from 'react';

export function useFocusMode() {
  const [focusMode, setFocusMode] = useState(false);
  const toggle = () => setFocusMode(f => !f);
  return { focusMode, toggle };
}
