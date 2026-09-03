import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import { ADMIN_ROUTE } from './config/admin';

// Carga perezosa (lazy) del panel privado: NUNCA se descarga en el bundle público de los visitantes
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
