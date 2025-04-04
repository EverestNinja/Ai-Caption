import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Privacy from './Pages/Privacy/Privacy';
import SettingsPanel from './components/SettingsPanel';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Landing />} />
      <Route path="/generate" element={<Generation />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  );
};

export default Routes; 