import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PublicLayout } from '@/components/PublicLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SidebarProvider } from '@/components/admin/AdminUI';

// ── Public pages (lazy) ──
const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const Services = lazy(() => import('@/pages/public/Services'));
const Events = lazy(() => import('@/pages/public/Events'));
const EventDetail = lazy(() => import('@/pages/public/EventDetail'));
const Portfolio = lazy(() => import('@/pages/public/Portfolio'));
const PortfolioDetail = lazy(() => import('@/pages/public/PortfolioDetail'));
const HowWeWork = lazy(() => import('@/pages/public/HowWeWork'));
const PlanYourEvent = lazy(() => import('@/pages/public/PlanYourEvent'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

// ── Admin pages (lazy) ──
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const EventsAdmin = lazy(() => import('@/pages/admin/EventsAdmin'));
const EventForm = lazy(() => import('@/pages/admin/EventForm'));
const PortfolioAdmin = lazy(() => import('@/pages/admin/PortfolioAdmin'));
const PortfolioForm = lazy(() => import('@/pages/admin/PortfolioForm'));
const TestimonialsAdmin = lazy(() => import('@/pages/admin/TestimonialsAdmin'));
const FAQsAdmin = lazy(() => import('@/pages/admin/FAQsAdmin'));
const BookingsAdmin = lazy(() => import('@/pages/admin/BookingsAdmin'));
const MediaAdmin = lazy(() => import('@/pages/admin/MediaAdmin'));
const SettingsAdmin = lazy(() => import('@/pages/admin/SettingsAdmin'));
const CMSPageEditor = lazy(() => import('@/pages/admin/CMSPageEditor'));
const ServicesCMSAdmin = lazy(() => import('@/pages/admin/ServicesCMSAdmin'));
const PagesAdmin = lazy(() => import('@/pages/admin/PagesAdmin'));
const PageBuilderAdmin = lazy(() => import('@/pages/admin/PageBuilderAdmin'));

function AdminFallback() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/40">
        <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

function PublicFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex items-center gap-3 text-stone">
        <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PublicFallback />}>
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
            <Route path="/admin" element={<ProtectedRoute><SidebarProvider><AdminLayout /></SidebarProvider></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
              <Route path="home" element={<Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="home" pageTitle="Home CMS" /></Suspense>} />
              <Route path="about" element={<Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="about" pageTitle="About CMS" /></Suspense>} />
              <Route path="services" element={<Suspense fallback={<AdminFallback />}><ServicesCMSAdmin /></Suspense>} />
              <Route path="how-we-work" element={<Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="how-we-work" pageTitle="How We Work CMS" /></Suspense>} />
              <Route path="events" element={<Suspense fallback={<AdminFallback />}><EventsAdmin /></Suspense>} />
              <Route path="events/new" element={<Suspense fallback={<AdminFallback />}><EventForm /></Suspense>} />
              <Route path="events/:id/edit" element={<Suspense fallback={<AdminFallback />}><EventForm /></Suspense>} />
              <Route path="portfolio" element={<Suspense fallback={<AdminFallback />}><PortfolioAdmin /></Suspense>} />
              <Route path="portfolio/new" element={<Suspense fallback={<AdminFallback />}><PortfolioForm /></Suspense>} />
              <Route path="portfolio/:id/edit" element={<Suspense fallback={<AdminFallback />}><PortfolioForm /></Suspense>} />
              <Route path="testimonials" element={<Suspense fallback={<AdminFallback />}><TestimonialsAdmin /></Suspense>} />
              <Route path="faqs" element={<Suspense fallback={<AdminFallback />}><FAQsAdmin /></Suspense>} />
              <Route path="media" element={<Suspense fallback={<AdminFallback />}><MediaAdmin /></Suspense>} />
              <Route path="pages" element={<Suspense fallback={<AdminFallback />}><PagesAdmin /></Suspense>} />
              <Route path="pages/:pageId" element={<Suspense fallback={<AdminFallback />}><PageBuilderAdmin /></Suspense>} />
              <Route path="bookings" element={<Suspense fallback={<AdminFallback />}><BookingsAdmin /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<AdminFallback />}><SettingsAdmin /></Suspense>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
