import React from "react";

export function HeaderTitle(props: React.PropsWithChildren<{}>) {
  return <div className="header-title">{props.children}</div>;
}
