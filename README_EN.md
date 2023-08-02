## Usage

```jsx
const Modal = ({ onClose, children }) => {
  useKeyboard({
    key: "Escape",
    callback: onClose,
    disabled: false,
  });

  return <div>{children}</div>;
};
```

## Props:

- **key** is `KeyboardEvent.key`. It is a way to specify key. The whole list of available key names [here](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values). _Required parameter_
- **callback** is a function that should be called when the `key` is pressed. _Required parameter_
- **disabled** is a flag to disable / enable the hook. _Optional parameter. `false` by default_
