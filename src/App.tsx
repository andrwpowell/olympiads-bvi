import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useScrollTop } from "./lib/hooks";
import HomePage from "./pages/HomePage";
import PickerPage from "./pages/PickerPage";
import UniversitiesPage from "./pages/UniversitiesPage";
import UniversityPage from "./pages/UniversityPage";
import OlympiadsPage from "./pages/OlympiadsPage";
import SourcesPage from "./pages/SourcesPage";
import AboutPage from "./pages/AboutPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useScrollTop(pathname);
  return null;
};

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/picker" element={<PickerPage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/universities/:slug" element={<UniversityPage />} />
          <Route path="/olympiads" element={<OlympiadsPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
