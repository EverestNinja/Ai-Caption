import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Privacy from './Pages/Privacy/Privacy';
import Flyer from './Pages/Flyer/Flyer';
import Publish from './Pages/Publish/Publish';
import Login from './Pages/Login/Login';
import Terms from './Pages/Terms/Terms';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/generate" element={<Generation />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/flyer" element={<Flyer />} />
      <Route path="/publish" element={<Publish />} />
    </RouterRoutes>
  );
};

export default Routes; 