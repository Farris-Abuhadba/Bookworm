import { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Navbar>
      {children}
      <Footer />
    </Navbar>
  );
};
export default Layout;
