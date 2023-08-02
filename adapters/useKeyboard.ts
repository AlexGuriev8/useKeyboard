import { useCallback, useRef, useSyncExternalStore } from "react";

import { addCallback } from "../core";
import { Callback, WrappedCallback, Key } from "../types";

type Props = {
  key: Key;
  callback: Callback;
  disabled?: boolean;
};

export const useKeyboard = ({ key, callback, disabled = false }: Props) => {
  const wrappedCallback = useRef<WrappedCallback>(null);

  wrappedCallback.current = { callback };

  const subscribe = useCallback(() => {
    if (disabled) return () => null;

    const removeCallback = addCallback({
      key,
      wrappedCallback,
    });

    return removeCallback;
  }, [key, disabled]);

  useSyncExternalStore(subscribe, () => null);
};
