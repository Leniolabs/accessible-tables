import React from "react";

export function Indicator(
  props: React.PropsWithChildren<{
    value: number;
    label: string;
  }>
) {
  return (
    <div className="indicator">
      <div className="indicator-value">{props.value}</div>
      <div className="indicator-label">{props.label}</div>
    </div>
  );
}
