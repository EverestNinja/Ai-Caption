import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Privacy from './Pages/Privacy/Privacy';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Landing />} />
      <Route path="/generate" element={<Generation />} />
      <Route path="/privacy" element={<Privacy />} />
    </RouterRoutes>
  );
};

export default Routes; 