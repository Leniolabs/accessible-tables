import React from "react";

export function SectiontContent(
  props: React.PropsWithChildren<{
    flex?: boolean;
    align?: "left" | "right" | "center";
  }>
) {
  return (
    <div
      className={`section-content ${props.flex ? "flex" : ""} ${
        props.align ? "section-content-" + props.align : ""
      }`}
    >
      {props.children}
    </div>
  );
}
