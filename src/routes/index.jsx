import About from "../pages/About";
import AdminPage from "../pages/admin/AdminPage";
import ManageCollegesPage from "../pages/admin/ManageCollegesPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
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
import CollegeMap from "../components/CollegeMap";
import TimelineTracker from "../components/TimelineTracker";
import PersonalizedDashboard from "../components/PersonalizedDashboard";

const routes = [{ path: PathConstants.ABOUT, element: <About /> }];

export const adminRoutes = [
  {
    path: PathConstants.ADMIN,
    element: <AdminPage />,
  },
  {
    path: PathConstants.MANAGEUSERS,
    element: <ManageUsersPage />,
  },
  {
    path: PathConstants.MANAGECOLLEGES,
    element: <ManageCollegesPage />,
  },
];

export const userRoutes = [
  {
    path: PathConstants.HOME,
    element: <Home />,
  },
  {
    path: PathConstants.COMMERCE,
    element: <Commerce />,
  },
  {
    path: PathConstants.SCIENCE,
    element: <Science />,
  },
  {
    path: PathConstants.TECHNOLOGY,
    element: <Technology />,
  },
  {
    path: PathConstants.DESIGN,
    element: <Design />,
  },
  {
    path: PathConstants.ARTS,
    element: <Arts />,
  },

  {
    path: PathConstants.PROFILE,
    element: <Profile />,
  },
  {
    path: PathConstants.SEARCH,
    element: <SearchPage />,
  },
  {
    path: PathConstants.APTITUDE,
    element: <AptitudeTest />,
  },
  {
    path: PathConstants.CAREERPATHS,
    element: <CareerPathMapping />,
  },
  {
    path: PathConstants.COLLEGEMAP,
    element: <CollegeMap />,
  },
  {
    path: PathConstants.TIMELINE,
    element: <TimelineTracker />,
  },
  {
    path: PathConstants.DASHBOARD,
    element: <PersonalizedDashboard />,
  },
  {
    path: PathConstants.MEDICINE,
    element: <Medicine />,
  },
  {
    path: PathConstants.ENGINEERING,
    element: <Engineering />,
  },
  {
    path: PathConstants.BIOTECHNOLOGY,
    element: <Biotechnology />,
  },
  {
    path: PathConstants.EVS,
    element: <EnvironmentalScience />,
  },
  {
    path: PathConstants.RESEARCH,
    element: <ResearchScience />,
  },
  {
    path: PathConstants.ACCOUNTING,
    element: <Accounting />,
  },
  {
    path: PathConstants.MARKETING,
    element: <Marketing />,
  },
  {
    path: PathConstants.FINANCE,
    element: <Finance />,
  },
  {
    path: PathConstants.BUSINESS,
    element: <BusinessManagement />,
  },
  {
    path: PathConstants.ECONOMICS,
    element: <Economics />,
  },
  {
    path: PathConstants.SOFTWAREDEV,
    element: <SoftwareDevolopment />,
  },
  {
    path: PathConstants.CYBERSECURITY,
    element: <CyberSecurity />,
  },
  {
    path: PathConstants.DATASCIENCE,
    element: <DataScience />,
  },
  {
    path: PathConstants.AI,
    element: <ArtificialIntelligence />,
  },
  {
    path: PathConstants.CLOUD,
    element: <CloudComputing />,
  },
  {
    path: PathConstants.FINEARTS,
    element: <FineArts />,
  },
  {
    path: PathConstants.LITERATURE,
    element: <Literature />,
  },
  {
    path: PathConstants.PERFORMINGARTS,
    element: <PerformingArts />,
  },
  {
    path: PathConstants.HISTORYANDCULTURE,
    element: <HistoryCulture />,
  },
  {
    path: PathConstants.JOURNALISM,
    element: <Journalism />,
  },
  {
    path: PathConstants.GRAPHICDESIGN,
    element: <GraphicDesign />,
  },
  {
    path: PathConstants.INTERIORDESIGN,
    element: <InteriorDesign />,
  },
  {
    path: PathConstants.INDUSTRYDESIGN,
    element: <IndustrialDesign />,
  },
  {
    path: PathConstants.UIUX,
    element: <UIUXDesign />,
  },
  {
    path: PathConstants.FASHION,
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
