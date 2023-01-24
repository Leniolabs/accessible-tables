import React from "react";

export function ButtonIcon(
  props: React.PropsWithChildren<{
    onClick?: () => void;
    image: string;
  }>
) {
  return (
    <div className={`button-icon`} onClick={props.onClick}>
      <img src={props.image} />
    </div>
  );
}
