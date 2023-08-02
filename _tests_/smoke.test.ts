import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useKeyboard } from '../index';
import { keys } from './keys';

describe('[keyboardManager] base', () => {
  it.each(keys)('should call key callback once', (key) => {
    const callback = jest.fn();

    renderHook(() =>
      useKeyboard({
        key: key,
        callback,
      })
    );

    userEvent.keyboard(`{${key}}`);

    expect(callback).toBeCalledTimes(1);
  });

  it.each(keys)('should call key callback multiple times', (key) => {
    const callback = jest.fn();

    renderHook(() =>
      useKeyboard({
        key: key,
        callback,
      })
    );

    const amountOfCalls = Math.round(Math.random() * 10);

    for (let i = 0; i < amountOfCalls; i++) {
      userEvent.keyboard(`{${key}}`);
    }

    expect(callback).toBeCalledTimes(amountOfCalls);
  });

  it.each(keys)(
    'should not call key callback when hook is unmounted',
    (key) => {
      const callback = jest.fn();

      const { unmount } = renderHook(() =>
        useKeyboard({
          key: key,
          callback,
        })
      );

      userEvent.keyboard(`{${key}}`);
      unmount();
      userEvent.keyboard(`{${key}}`);

      expect(callback).toBeCalledTimes(1);
    }
  );

  it.each(keys)(
    'should not call key callback when hook is unmounted',
    (key) => {
      const callback = jest.fn();

      const { unmount } = renderHook(() =>
        useKeyboard({
          key: key,
          callback,
        })
      );

      const amountOfCallsBeforUnmount = Math.round(Math.random() * 10);

      for (let i = 0; i < amountOfCallsBeforUnmount; i++) {
        userEvent.keyboard(`{${key}}`);
      }

      unmount();

      const amountOfCallsAfterUnmount = Math.round(Math.random() * 10);

      for (let i = 0; i < amountOfCallsAfterUnmount; i++) {
        userEvent.keyboard(`{${key}}`);
      }

      expect(callback).toBeCalledTimes(amountOfCallsBeforUnmount);
    }
  );

  it.each(keys)('Should call callback passed in the last render', (key) => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { rerender } = renderHook(
      ({ callback }) =>
        useKeyboard({
          key: key,
          callback,
        }),
      { initialProps: { callback: callback1 } }
    );

    rerender({ callback: callback2 });
    userEvent.keyboard(`{${key}}`);
    userEvent.keyboard(`{${key}}`);

    expect(callback1).toBeCalledTimes(0);
    expect(callback2).toBeCalledTimes(2);
  });
});
