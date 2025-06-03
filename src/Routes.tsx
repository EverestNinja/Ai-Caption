// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Privacy from './Pages/Privacy/Privacy';
import Flyer from './Pages/Flyer/Flyer';
import Publish from './Pages/Publish/Publish';
import Terms from './Pages/Terms/Terms';
import AuthPage from './components/AuthPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import PricingSection from './Pages/Pricing/Pricing';

interface SessionProps {
  session: unknown;
}

const Routes = ({ session }: SessionProps) => {
  return (
    <RouterRoutes>
      {/* Public landing page */}
      <Route path="/" element={<Landing />} />

      {/* LOGIN: only for unauthenticated users; if session exists, send them to /generate */}
      <Route
        path="/login"
        element={!session ? <AuthPage /> : <Navigate to="/generate" replace />}
      />

      {/* GENERATE: only for authenticated users; otherwise redirect to /login */}
      <Route
        path="/generate"
        element={session ? <Generation /> : <Navigate to="/login" replace />}
      />

      {/* Privacy and Terms are still public */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* These “new” pages you have should remain as-is (no auth restriction) */}
      <Route path="/flyer"
        element={session ? <Flyer /> : <Navigate to="/login" replace />}
      />
      <Route path="/publish"
        element={session ? <Publish /> : <Navigate to="/login" replace />}
      />
      {/* favorite page not available */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/pricing" element={<PricingSection />} />
    </RouterRoutes>
  );
};

export default Routes;
