import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import BackButton from "../components/BackButton";

function Layout() {
  return (
    <div className="">
      <BackButton />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
