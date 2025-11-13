import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Sidebar from "../components/Sidebar";

function UserLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <Sidebar />
    </>
  );
}

export default UserLayout;
