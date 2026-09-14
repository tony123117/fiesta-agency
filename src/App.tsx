import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PublicLayout } from '@/components/PublicLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SidebarProvider, AdminErrorBoundary } from '@/components/admin/AdminUI';

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
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const Terms = lazy(() => import('@/pages/public/Terms'));
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
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin protected routes */}
            <Route path="/admin" element={<ProtectedRoute><SidebarProvider><AdminLayout /></SidebarProvider></ProtectedRoute>}>
              <Route index element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><Dashboard /></Suspense></AdminErrorBoundary>} />
              <Route path="home" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="home" pageTitle="Home CMS" /></Suspense></AdminErrorBoundary>} />
              <Route path="about" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="about" pageTitle="About CMS" /></Suspense></AdminErrorBoundary>} />
              <Route path="services" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><ServicesCMSAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="how-we-work" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><CMSPageEditor pageSlug="how-we-work" pageTitle="How We Work CMS" /></Suspense></AdminErrorBoundary>} />
              <Route path="events" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><EventsAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="events/new" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><EventForm /></Suspense></AdminErrorBoundary>} />
              <Route path="events/:id/edit" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><EventForm /></Suspense></AdminErrorBoundary>} />
              <Route path="portfolio" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><PortfolioAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="portfolio/new" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><PortfolioForm /></Suspense></AdminErrorBoundary>} />
              <Route path="portfolio/:id/edit" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><PortfolioForm /></Suspense></AdminErrorBoundary>} />
              <Route path="testimonials" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><TestimonialsAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="faqs" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><FAQsAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="media" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><MediaAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="pages" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><PagesAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="pages/:pageId" element={<AdminErrorBoundary fallbackTitle="Page Builder Error" fallbackMessage="The page builder encountered an error. This may be due to a data issue or a component crash."><Suspense fallback={<AdminFallback />}><PageBuilderAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="bookings" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><BookingsAdmin /></Suspense></AdminErrorBoundary>} />
              <Route path="settings" element={<AdminErrorBoundary><Suspense fallback={<AdminFallback />}><SettingsAdmin /></Suspense></AdminErrorBoundary>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
