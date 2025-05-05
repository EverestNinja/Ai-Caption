import { IconButton, useMediaQuery } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";

interface BackButtonProps {
  customTop?: number | string;
  customLeft?: number | string;
}

const BackButton = ({ customTop, customLeft }: BackButtonProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { isExpanded, collapsedWidth, expandedWidth } = useSidebar();
  
  // Use mediaQuery to detect mobile devices
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // State to track the sidebar width for smooth animation
  const [leftPosition, setLeftPosition] = useState<string>(() => {
    const basePosition = isExpanded ? expandedWidth : collapsedWidth;
    return customLeft !== undefined ? `${customLeft}px` : `${basePosition + 20}px`;
  });

  // Update position when sidebar state changes
  useEffect(() => {
    const basePosition = isExpanded ? expandedWidth : collapsedWidth;
    setLeftPosition(customLeft !== undefined ? `${customLeft}px` : `${basePosition + 20}px`);
  }, [isExpanded, expandedWidth, collapsedWidth, customLeft]);

  // If on mobile, don't render the back button at all
  if (isMobile) {
    return null;
  }

  return (
    <IconButton
      onClick={() => navigate(-1)}
      sx={{
        position: 'fixed',
        top: customTop !== undefined ? customTop : 20,
        left: leftPosition,
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
        // Match the sidebar transition exactly
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1), left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <FaArrowLeft />
    </IconButton>
  );
};

export default BackButton; 