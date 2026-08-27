import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PublicLayout } from '@/components/PublicLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Public pages
import { Home } from '@/pages/public/Home';
import { About } from '@/pages/public/About';
import { Services } from '@/pages/public/Services';
import { Events } from '@/pages/public/Events';
import { EventDetail } from '@/pages/public/EventDetail';
import { Portfolio } from '@/pages/public/Portfolio';
import { PortfolioDetail } from '@/pages/public/PortfolioDetail';
import { HowWeWork } from '@/pages/public/HowWeWork';
import { PlanYourEvent } from '@/pages/public/PlanYourEvent';
import { Contact } from '@/pages/public/Contact';
import { NotFound } from '@/pages/public/NotFound';

// Admin pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { Dashboard } from '@/pages/admin/Dashboard';
import { EventsAdmin } from '@/pages/admin/EventsAdmin';
import { EventForm } from '@/pages/admin/EventForm';
import { PortfolioAdmin } from '@/pages/admin/PortfolioAdmin';
import { PortfolioForm } from '@/pages/admin/PortfolioForm';
import { TestimonialsAdmin } from '@/pages/admin/TestimonialsAdmin';
import { FAQsAdmin } from '@/pages/admin/FAQsAdmin';
import { BookingsAdmin } from '@/pages/admin/BookingsAdmin';
import { MediaAdmin } from '@/pages/admin/MediaAdmin';
import { SettingsAdmin } from '@/pages/admin/SettingsAdmin';
import { CMSPageEditor } from '@/pages/admin/CMSPageEditor';
import { ServicesCMSAdmin } from '@/pages/admin/ServicesCMSAdmin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/plan-your-event" element={<PlanYourEvent />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<CMSPageEditor pageSlug="home" pageTitle="Home CMS" />} />
            <Route path="about" element={<CMSPageEditor pageSlug="about" pageTitle="About CMS" />} />
            <Route path="services" element={<ServicesCMSAdmin />} />
            <Route path="how-we-work" element={<CMSPageEditor pageSlug="how-we-work" pageTitle="How We Work CMS" />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/:id/edit" element={<EventForm />} />
            <Route path="portfolio" element={<PortfolioAdmin />} />
            <Route path="portfolio/new" element={<PortfolioForm />} />
            <Route path="portfolio/:id/edit" element={<PortfolioForm />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="faqs" element={<FAQsAdmin />} />
            <Route path="media" element={<MediaAdmin />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
