import Footer from "../Footer";
import Header from "../Header";
import { Container, Main } from "./styles";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
};

export default Layout;
