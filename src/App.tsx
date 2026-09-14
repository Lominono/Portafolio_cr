import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ADMIN_ROUTE } from './config/admin';
// Carga perezosa (lazy) de todas las páginas para optimizar rendimiento y tiempo de carga
const Home = lazy(() => import('./pages/Home'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith(ADMIN_ROUTE);

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen bg-primary flex items-center justify-center p-6">
            <div className="w-8 h-8 border-2 border-accentMain border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-mi" element={<About />} />
            <Route path="/tarifas" element={<Pricing />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            {/* Ruta Secreta del Panel Privado */}
            <Route path={ADMIN_ROUTE} element={<AdminPanel />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <ScrollToTopButton />}
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
