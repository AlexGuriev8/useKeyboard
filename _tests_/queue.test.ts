import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useKeyboard } from '../index';
import { keys } from './keys';

describe('[keyboardManager] queue', () => {
  it.each(keys)('should call callback only of the last hook', (key) => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback1,
      })
    );

    renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback2,
      })
    );

    userEvent.keyboard(`{${key}}`);

    expect(callback1).toBeCalledTimes(0);
    expect(callback2).toBeCalledTimes(1);
  });

  it.each(keys)('should call callback only of the last mounted hook', (key) => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { unmount: unmount1 } = renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback1,
      })
    );

    const { unmount: unmount2 } = renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback2,
      })
    );

    userEvent.keyboard(`{${key}}`);
    unmount2();
    userEvent.keyboard(`{${key}}`);
    unmount1();
    userEvent.keyboard(`{${key}}`);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  it.each(keys)(
    'should call callback of the last mounted hook even previous unmounted',
    (key) => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { unmount: unmount1 } = renderHook(() =>
        useKeyboard({
          key: key,
          callback: callback1,
        })
      );

      renderHook(() =>
        useKeyboard({
          key: key,
          callback: callback2,
        })
      );

      userEvent.keyboard(`{${key}}`);
      unmount1();
      userEvent.keyboard(`{${key}}`);

      expect(callback1).toBeCalledTimes(0);
      expect(callback2).toBeCalledTimes(2);
    }
  );

  it.each(keys)('should handle different queues', (key) => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback1,
      })
    );

    renderHook(() =>
      useKeyboard({
        key: '-',
        callback: callback2,
      })
    );

    userEvent.keyboard(`{${key}}`);
    userEvent.keyboard('-');

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  it.each(keys)('should handle different queues with multiple hooks', (key) => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const callback4 = jest.fn();

    const { unmount: unmount1 } = renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback1,
      })
    );

    renderHook(() =>
      useKeyboard({
        key: '-',
        callback: callback2,
      })
    );

    const { unmount: unmount3 } = renderHook(() =>
      useKeyboard({
        key: key,
        callback: callback3,
      })
    );

    renderHook(() =>
      useKeyboard({
        key: '-',
        callback: callback4,
      })
    );

    userEvent.keyboard(`{${key}}`);
    userEvent.keyboard('-');
    unmount3();
    userEvent.keyboard(`{${key}}`);
    userEvent.keyboard('-');
    unmount1();
    userEvent.keyboard(`{${key}}`);
    userEvent.keyboard('-');

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(0);
    expect(callback3).toBeCalledTimes(1);
    expect(callback4).toBeCalledTimes(3);
  });
});
