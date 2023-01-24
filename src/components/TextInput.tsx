import React from "react";

export function TextInput(
  props: React.PropsWithChildren<{
    onChange?: (value: string) => void;
    value: string;
    inputRequired?: boolean;
  }>
) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e.target.value);
    },
    [props.onChange]
  );

  return (
    <div className="input-container">
      <div className="input-label">{props.children}</div>
      <input
        type="text"
        className={
          !props.inputRequired
          ? "input"
          : "input-required"
        }
        value={props.value}
        onChange={handleChange}
      />
    </div>
  );
}
