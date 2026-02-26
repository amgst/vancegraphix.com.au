import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import DesignProcess from './pages/DesignProcess';
import Printing from './pages/Printing';
import ShopifyLanding from './pages/ShopifyLanding';
import WebDevLanding from './pages/WebDevLanding';
import GraphicsLanding from './pages/GraphicsLanding';
import VideoAnimation from './pages/VideoAnimation';
import AiServices from './pages/AiServices';
import WordPressLanding from './pages/WordPressLanding';
import ProjectInquiry from './pages/ProjectInquiry';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import PrintPortfolio from './pages/PrintPortfolio';
import WebsitesForSale from './pages/WebsitesForSale';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import Careers from './pages/Careers';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminWebRegistry from './pages/admin/WebRegistry';
import AdminTools from './pages/admin/Tools';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminPrintPortfolio from './pages/admin/PrintPortfolio';
import AdminServices from './pages/admin/Services';
import AdminBlog from './pages/admin/Blog';
import AdminReadySites from './pages/admin/ReadySites';
import AdminStore from './pages/admin/Store';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';
import AdminMessages from './pages/admin/Messages';
import AdminTestimonials from './pages/admin/Testimonials';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Reviews from './pages/Reviews';
import NotFound from './pages/NotFound';
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './components/admin/NotificationProvider';
import { SettingsProvider } from './components/SettingsProvider';
import { AuthProvider } from './components/admin/AuthProvider';
import ProtectedRoute from './components/admin/ProtectedRoute';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fade-in">
      {children}
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/our-team" element={<About />} />
            <Route path="/design-process" element={<DesignProcess />} />
            <Route path="/printing" element={<Printing />} />
            <Route path="/shopify" element={<ShopifyLanding />} />
            <Route path="/web-dev" element={<WebDevLanding />} />
            <Route path="/graphics" element={<GraphicsLanding />} />
            <Route path="/video-animation" element={<VideoAnimation />} />
            <Route path="/ai-services" element={<AiServices />} />
            <Route path="/wordpress" element={<WordPressLanding />} />
            <Route path="/inquiry" element={<ProjectInquiry />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/print-portfolio" element={<PrintPortfolio />} />
            <Route path="/print-portfolio/:slug" element={<PrintPortfolio />} />
            <Route path="/websites-for-sale" element={<WebsitesForSale />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/reviews" element={<Reviews />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            }>
              <Route index element={<AdminLogin />} />
              <Route path="login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="tools" element={<AdminTools />} />
                <Route path="portfolio" element={<AdminPortfolio />} />
                <Route path="web-registry" element={<AdminWebRegistry />} />
                <Route path="print-portfolio" element={<AdminPrintPortfolio />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="ready-sites" element={<AdminReadySites />} />
                <Route path="store" element={<AdminStore />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
