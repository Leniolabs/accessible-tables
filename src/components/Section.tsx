import React from "react";

export function Section(props: React.PropsWithChildren<{}>) {
  return <section className="section">{props.children}</section>;
}
