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
import ShopifyLanding from './pages/ShopifyLanding';
import WebDevLanding from './pages/WebDevLanding';
import GraphicsLanding from './pages/GraphicsLanding';
import WordPressLanding from './pages/WordPressLanding';
import ProjectInquiry from './pages/ProjectInquiry';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import WebsitesForSale from './pages/WebsitesForSale';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import Careers from './pages/Careers';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTools from './pages/admin/Tools';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminServices from './pages/admin/Services';
import AdminBlog from './pages/admin/Blog';
import AdminReadySites from './pages/admin/ReadySites';
import AdminSettings from './pages/admin/Settings';
import AdminMessages from './pages/admin/Messages';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import NotFound from './pages/NotFound';
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './components/admin/NotificationProvider';
import { SettingsProvider } from './components/SettingsProvider';

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/shopify" element={<ShopifyLanding />} />
            <Route path="/web-dev" element={<WebDevLanding />} />
            <Route path="/graphics" element={<GraphicsLanding />} />
            <Route path="/wordpress" element={<WordPressLanding />} />
            <Route path="/inquiry" element={<ProjectInquiry />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/websites-for-sale" element={<WebsitesForSale />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            }>
              <Route index element={<AdminLogin />} />
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="ready-sites" element={<AdminReadySites />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
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
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </SettingsProvider>
  );
};

export default App;
