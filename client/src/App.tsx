import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CollectionPage from "@/pages/CollectionPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import AboutPage from "@/pages/AboutPage";
import LegalPage from "@/pages/LegalPage";

export default function App() {
  const location = useLocation();

  // A new page starts at the top, or at the section a link points to
  // (e.g. /mentions-legales#cgv). Keyed on path and hash only, so changing
  // a shop filter (?category=) doesn't jump the page.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-nuit text-ivoire">
      <Navbar />
      <main
        key={location.pathname}
        className="flex-1 animate-page-enter"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/collection/:slug" element={<CollectionPage />} />
          <Route path="/produit/:slug" element={<ProductPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
          <Route
            path="/confirmation/:orderId"
            element={<OrderConfirmationPage />}
          />
          <Route path="/maison" element={<AboutPage />} />
          <Route path="/mentions-legales" element={<LegalPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
