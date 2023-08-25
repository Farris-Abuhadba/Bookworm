import { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return <Navbar>{children}</Navbar>;
};
export default Layout;
