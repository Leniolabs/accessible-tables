import React from "react";

export function Button(
  props: React.PropsWithChildren<{
    onClick?: () => void;
    size: "small" | "big";
    fullWidth?: boolean;
  }>
) {
  return (
    <button
      className={`button button-${props.size} ${
        props.fullWidth ? "full-width" : ""
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
