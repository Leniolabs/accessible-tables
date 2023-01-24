import React from "react";

export function Toggle(
  props: React.PropsWithChildren<{
    value: boolean;
    onClick?: () => void;
  }>
) {
  return (
    <div className="toggle-container">
      <div
        className={`toggle ${props.value ? "toggled" : ""}`}
        onClick={props.onClick}
      >
        <div className="toggle-handle" />
      </div>
      <div className="toggle-label">{props.children}</div>
    </div>
  );
}
