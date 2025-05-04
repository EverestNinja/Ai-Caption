import { IconButton } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";

// Define transition constants
const TRANSITION_TIMING = '0.3s ease';

interface BackButtonProps {
  customTop?: number | string;
  customLeft?: number | string;
}

const BackButton = ({ customTop, customLeft }: BackButtonProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { isExpanded, collapsedWidth, expandedWidth } = useSidebar();

  // Calculate the left position based on sidebar state
  const calculateLeftPosition = () => {
    const basePosition = isExpanded ? expandedWidth : collapsedWidth;
    return customLeft !== undefined ? customLeft : `${basePosition + 20}px`;
  };

  return (
    <IconButton
      onClick={() => navigate(-1)}
      sx={{
        position: 'fixed',
        top: customTop !== undefined ? customTop : 20,
        left: calculateLeftPosition(),
        color: isDarkMode ? '#ffffff' : '#121212',
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        zIndex: 1100,
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <FaArrowLeft />
    </IconButton>
  );
};

export default BackButton; 