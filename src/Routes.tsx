import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Privacy from './Pages/Privacy/Privacy';
import Choose from './Pages/Choose/Choose';
import Flyer from './Pages/Flyer/Flyer';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Landing />} />
      <Route path="/generate" element={<Generation />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/choose" element={<Choose />} />
      <Route path="/flyer" element={<Flyer />} />
    </RouterRoutes>
  );
};

export default Routes; 