import React, { PropsWithChildren } from "react";
import { Navbar } from "./Header";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default Layout;
