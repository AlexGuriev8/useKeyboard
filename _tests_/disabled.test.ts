import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useKeyboard } from '../index';
import { keys } from './keys';

describe('[keyboardManager] disabled state', () => {
  it.each(keys)('should not call key callback as it is disabled', (key) => {
    const callback = jest.fn();

    renderHook(() =>
      useKeyboard({
        key: key,
        callback,
        disabled: true,
      })
    );

    userEvent.keyboard(`{${key}}`);

    expect(callback).toBeCalledTimes(0);
  });

  it.each(keys)(
    'should call key callback only if it is not disabled',
    (key) => {
      const callback = jest.fn();

      const { rerender } = renderHook(
        ({ disabled }) =>
          useKeyboard({
            key: key,
            callback,
            disabled,
          }),
        { initialProps: { disabled: false } }
      );

      userEvent.keyboard(`{${key}}`);
      rerender({ disabled: true });
      userEvent.keyboard(`{${key}}`);

      expect(callback).toBeCalledTimes(1);
    }
  );

  it.each(keys)(
    'should call key callback only for the last not disabled hook',
    (key) => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { rerender: rerender1 } = renderHook(
        ({ disabled }) =>
          useKeyboard({
            key: key,
            callback: callback1,
            disabled,
          }),
        { initialProps: { disabled: false } }
      );

      const { rerender: rerender2 } = renderHook(
        ({ disabled }) =>
          useKeyboard({
            key: key,
            callback: callback2,
            disabled,
          }),
        { initialProps: { disabled: false } }
      );

      userEvent.keyboard(`{${key}}`);
      rerender2({ disabled: true });
      userEvent.keyboard(`{${key}}`);
      rerender1({ disabled: true });

      userEvent.keyboard(`{${key}}`);

      rerender1({ disabled: false });
      userEvent.keyboard(`{${key}}`);
      rerender2({ disabled: false });
      userEvent.keyboard(`{${key}}`);

      expect(callback1).toBeCalledTimes(2);
      expect(callback2).toBeCalledTimes(2);
    }
  );
});
