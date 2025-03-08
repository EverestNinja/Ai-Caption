import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Layout = ({ children, isDarkMode }: LayoutProps) => {
  return (
    <Box
      component={motion.div}
      initial={false}
      animate={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)'
          : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
      <Footer isDarkMode={isDarkMode} />
    </Box>
  );
};

export default Layout; 