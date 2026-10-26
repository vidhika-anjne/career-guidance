import About from "../pages/About";
import AdminPage from "../pages/admin/AdminPage";
import ManageCollegesPage from "../pages/admin/ManageCollegesPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import ManageTestsPage from "../pages/admin/ManageTestsPage";
import Arts from "../pages/arts/Arts";
import FineArts from "../pages/arts/FineArts";
import HistoryCulture from "../pages/arts/HistoryCulture";
import Journalism from "../pages/arts/Journalism";
import Literature from "../pages/arts/Literature";
import PerformingArts from "../pages/arts/PerformingArts";
import Accounting from "../pages/commerce/Accounting";
import BusinessManagement from "../pages/commerce/BusinessManagement";
import Commerce from "../pages/commerce/Commerce";
import Economics from "../pages/commerce/Economics";
import Finance from "../pages/commerce/Finance";
import Marketing from "../pages/commerce/Marketing";
import Design from "../pages/design/Design";
import FashionDesign from "../pages/design/FashionDesign";
import GraphicDesign from "../pages/design/GraphicDesign";
import IndustrialDesign from "../pages/design/IndustrialDesign";
import InteriorDesign from "../pages/design/InteriorDesign";
import UIUXDesign from "../pages/design/UIUXDesign";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Biotechnology from "../pages/science/Biotechnology";
import Engineering from "../pages/science/Engineering";
import EnvironmentalScience from "../pages/science/EnvironmentalScience";
import Medicine from "../pages/science/Medicine";
import ResearchScience from "../pages/science/ResearchScience";
import Science from "../pages/science/Science";
import SearchPage from "../pages/SearchPage";
import ArtificialIntelligence from "../pages/technology/ArtificialIntelligence";
import CloudComputing from "../pages/technology/CloudComputing";
import CyberSecurity from "../pages/technology/CyberSecurity";
import DataScience from "../pages/technology/DataScience";
import SoftwareDevolopment from "../pages/technology/SoftwareDevolopment";
import Technology from "../pages/technology/Technology";
import PathConstants from "./PathConstants";
import AptitudeTest from "../components/AptitudeTest";
import CareerPathMapping from "../components/CareerPathMapping";
import TimelineTracker from "../components/TimelineTracker";
import PersonalizedDashboard from "../components/PersonalizedDashboard";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";

const routes = [
  { path: PathConstants.ABOUT, element: <About /> },
  { path: PathConstants.LOGIN, element: <Login /> },
  { path: PathConstants.SIGNUP, element: <SignUp /> },
  { path: PathConstants.FORGOTPASSWORD, element: <ForgotPassword /> },
];

export const adminRoutes = [
  {
    path: "",
    element: <AdminPage />,
  },
  {
    path: "manage-users",
    element: <ManageUsersPage />,
  },
  {
    path: "manage-colleges",
    element: <ManageCollegesPage />,
  },
  {
    path: "manage-tests",
    element: <ManageTestsPage />,
  },
];

export const userRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "commerce",
    element: <Commerce />,
  },
  {
    path: "science",
    element: <Science />,
  },
  {
    path: "technology",
    element: <Technology />,
  },
  {
    path: "design",
    element: <Design />,
  },
  {
    path: "arts",
    element: <Arts />,
  },

  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "search",
    element: <SearchPage />,
  },
  {
    path: "aptitude-test",
    element: <AptitudeTest />,
  },
  {
    path: "career-paths",
    element: <CareerPathMapping />,
  },
  {
    path: "timeline",
    element: <TimelineTracker />,
  },
  {
    path: "dashboard",
    element: <PersonalizedDashboard />,
  },
  {
    path: "science/medicine",
    element: <Medicine />,
  },
  {
    path: "science/engineering",
    element: <Engineering />,
  },
  {
    path: "science/biotech",
    element: <Biotechnology />,
  },
  {
    path: "science/evs",
    element: <EnvironmentalScience />,
  },
  {
    path: "science/research",
    element: <ResearchScience />,
  },
  {
    path: "commerce/accounting",
    element: <Accounting />,
  },
  {
    path: "commerce/marketing",
    element: <Marketing />,
  },
  {
    path: "commerce/finance",
    element: <Finance />,
  },
  {
    path: "commerce/business",
    element: <BusinessManagement />,
  },
  {
    path: "commerce/economics",
    element: <Economics />,
  },
  {
    path: "technology/software_devolpoment",
    element: <SoftwareDevolopment />,
  },
  {
    path: "technology/cyber_security",
    element: <CyberSecurity />,
  },
  {
    path: "technology/data_science",
    element: <DataScience />,
  },
  {
    path: "technology/artificial_intelligence",
    element: <ArtificialIntelligence />,
  },
  {
    path: "technology/cloud_computing",
    element: <CloudComputing />,
  },
  {
    path: "arts/fine_arts",
    element: <FineArts />,
  },
  {
    path: "arts/literature",
    element: <Literature />,
  },
  {
    path: "arts/performing-arts",
    element: <PerformingArts />,
  },
  {
    path: "arts/history_and_culture",
    element: <HistoryCulture />,
  },
  {
    path: "arts/journalism",
    element: <Journalism />,
  },
  {
    path: "design/graphic_design",
    element: <GraphicDesign />,
  },
  {
    path: "design/interior_design",
    element: <InteriorDesign />,
  },
  {
    path: "design/industry_design",
    element: <IndustrialDesign />,
  },
  {
    path: "design/ui-ux",
    element: <UIUXDesign />,
  },
  {
    path: "design/fashion_design",
    element: <FashionDesign />,
  },
  //   ),
  // },
  // {
  //   path: PathConstants.SEARCH,
  //   element: (
  //     <PrivateRoute>
  //       <SearchPage />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: PathConstants.SEARCH,
  //   element: (
  //     <PrivateRoute>
  //       <SearchPage />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: PathConstants.SEARCH,
  //   element: (
  //     <PrivateRoute>
  //       <SearchPage />
  //     </PrivateRoute>
  //   ),
  // },
];

export default routes;
