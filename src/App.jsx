import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ThemeToggle from "./components/common/ThemeToggle";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { scrollToTopInstant } from "./utils/smoothScroll";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Must go through Lenis. A raw window.scrollTo(0, 0) sets the native
    // scroll position while Lenis is still animating toward its own target,
    // and Lenis immediately drags the page back down.
    scrollToTopInstant();
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <div className="bg-bg-main min-h-screen">

            <ThemeToggle />

            <Toaster position="bottom-right" />

            <Navbar />
            <ScrollToTop />

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/order" element={<Order />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>

            <Footer />
          </div>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
