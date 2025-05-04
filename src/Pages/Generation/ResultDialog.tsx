import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, IconButton, Button, Paper, Chip,
  useMediaQuery, Zoom, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMagic, FaCopy, FaTimes, FaCheck, 
  FaImage, FaShare, FaArrowRight
} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { CircularProgress } from '@mui/material';

interface GeneratedCaption {
  text: string;
}

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  generatedCaptions: GeneratedCaption[];
  selectedCaptionIndex: number;
  setSelectedCaptionIndex: (index: number) => void;
  copiedToClipboard: boolean;
  isRegenerating: boolean;
  canRegenerate: boolean;
  handleRegenerate: () => void;
  handleCopyCaption: (e?: React.MouseEvent, index?: number) => void;
  handleCreateFlyer: (e?: React.MouseEvent) => void;
  handlePublishContent: (e?: React.MouseEvent) => void;
  isDarkMode: boolean;
  isMobile: boolean;
}

const ResultDialog: React.FC<ResultDialogProps> = ({ 
  open,
  onClose,
  generatedCaptions,
  selectedCaptionIndex,
  setSelectedCaptionIndex,
  copiedToClipboard,
  isRegenerating,
  canRegenerate,
  handleRegenerate,
  handleCopyCaption,
  handleCreateFlyer,
  handlePublishContent,
  isDarkMode,
  isMobile
}) => {
  // For responsiveness
  const isExtraSmall = useMediaQuery('(max-width:400px)');
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 400 }}
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            transition: { duration: 0.4 },
            sx: {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #202124 0%, #1a1a1a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: { xs: '16px', sm: '20px' },
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              maxWidth: { xs: '95%', sm: '650px' },
              margin: { xs: '10px', sm: '20px' },
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          {/* Dialog Title/Header */}
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              pb: { xs: 2, sm: 2.5 },
              pt: { xs: 2, sm: 2.5 },
              px: { xs: 2.5, sm: 3 },
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(156, 39, 176, 0.1))' 
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.07), rgba(156, 39, 176, 0.03))',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.3), rgba(156, 39, 176, 0.2))'
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(156, 39, 176, 0.1))',
              py: 0.8,
              px: 1.5,
              borderRadius: '12px',
            }}>
              <Box sx={{ 
                bgcolor: 'primary.main',
                color: '#fff',
                borderRadius: '50%',
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaMagic size={isMobile ? 14 : 16} />
              </Box>
              <Typography
                variant="h5" 
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? '#fff' : '#333',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.3px',
                }}
              >
                Generated Content
              </Typography>
            </Box>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#fff' : '#000',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <FaTimes size={isMobile ? 16 : 20} />
            </IconButton>
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent
            sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3.5 } }}
          >
            <Box
              component={motion.div}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 0.5, sm: 1 },
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.01)',
                  borderRadius: { xs: '12px', sm: '16px' },
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    maxHeight: { xs: '50vh', sm: '60vh' },
                    overflowY: 'auto',
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 1, sm: 1.5 },
                    '&::-webkit-scrollbar': {
                      width: { xs: '6px', sm: '8px' },
                    },
                    '&::-webkit-scrollbar-track': {
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(103, 58, 183, 0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(103, 58, 183, 0.3)',
                      },
                    },
                  }}
                >
                  {generatedCaptions.map((caption, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Paper
                        component={motion.div}
                        whileHover={{ 
                          y: -2,
                          boxShadow: isDarkMode 
                            ? '0 6px 16px rgba(0, 0, 0, 0.25)' 
                            : '0 6px 16px rgba(0, 0, 0, 0.08)',
                          transition: { duration: 0.2 }
                        }}
                        elevation={0}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          mb: { xs: 2, sm: 2.5 },
                          background: index === selectedCaptionIndex
                            ? isDarkMode 
                              ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(156, 39, 176, 0.1))'
                              : 'linear-gradient(135deg, rgba(103, 58, 183, 0.08), rgba(156, 39, 176, 0.05))'
                            : isDarkMode 
                              ? 'rgba(255, 255, 255, 0.02)'
                              : 'rgba(255, 255, 255, 0.5)',
                          borderRadius: { xs: '10px', sm: '14px' },
                          border: `1px solid ${index === selectedCaptionIndex 
                            ? isDarkMode ? 'rgba(103, 58, 183, 0.3)' : 'rgba(103, 58, 183, 0.2)'
                            : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)',
                          boxShadow: index === selectedCaptionIndex 
                            ? isDarkMode 
                              ? '0 4px 12px rgba(103, 58, 183, 0.2)' 
                              : '0 4px 12px rgba(103, 58, 183, 0.1)'
                            : 'none',
                        }}
                        onClick={() => setSelectedCaptionIndex(index)}
                      >
                        {/* Caption header with number and copy button */}
                        <Box sx={{ 
                          display: 'flex',
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: { xs: 1.5, sm: 2 }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box 
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                border: `2px solid ${index === selectedCaptionIndex 
                                  ? '#673ab7' 
                                  : isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {index === selectedCaptionIndex && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                >
                                  <Box 
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      bgcolor: '#673ab7',
                                    }}
                                  />
                                </motion.div>
                              )}
                            </Box>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontWeight: 600,
                              }}
                            >
                              Caption {index + 1}
                            </Typography>
                          </Box>
                          <Tooltip title="Copy this caption" arrow placement="top">
                            <IconButton
                              component={motion.button}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCaption(e, index);
                              }}
                              size="small"
                              sx={{
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                padding: { xs: '6px', sm: '8px' },
                                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                '&:hover': {
                                  color: '#673ab7',
                                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(103, 58, 183, 0.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <FaCopy size={isMobile ? 14 : 16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        
                        {/* Caption text */}
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.8,
                            color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
                            fontFamily: '"Inter", sans-serif',
                            fontSize: { xs: '0.95rem', sm: '1.05rem' },
                            letterSpacing: '0.01em',
                          }}
                        >
                          {caption.text.split('\n\n').map((part, partIndex) => {
                            const isHashtags = part.startsWith('#');
                            return isHashtags ? null : (
                              <span key={partIndex}>
                                {part}
                                {partIndex < caption.text.split('\n\n').length - 1 && <><br /><br /></>}
                              </span>
                            );
                          })}
                        </Typography>
                        
                        {/* Hashtags */}
                        {caption.text.includes('#') && (
                          <Box sx={{ 
                            mt: { xs: 2, sm: 2.5 },
                            pt: { xs: 1.5, sm: 2 },
                            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                          }}>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                lineHeight: 1.8,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              {caption.text.split('\n\n').map((part, partIndex) => {
                                if (part.startsWith('#')) {
                                  return part.split(' ').map((tag, i) => (
                                    <Chip
                                      key={`${partIndex}-${i}`}
                                      label={tag}
                                      size="small"
                                      component={motion.div}
                                      whileHover={{ 
                                        scale: 1.05,
                                        y: -2,
                                        transition: { duration: 0.2 }
                                      }}
                                      sx={{
                                        m: { xs: 0.3, sm: 0.4 },
                                        background: isDarkMode 
                                          ? 'rgba(103, 58, 183, 0.2)' 
                                          : 'rgba(103, 58, 183, 0.1)',
                                        color: isDarkMode ? '#fff' : '#333',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        fontWeight: 500,
                                        height: { xs: '24px', sm: '28px' },
                                        borderRadius: '14px',
                                        border: `1px solid ${isDarkMode 
                                          ? 'rgba(103, 58, 183, 0.3)' 
                                          : 'rgba(103, 58, 183, 0.2)'}`,
                                        '&:hover': {
                                          background: isDarkMode 
                                            ? 'rgba(103, 58, 183, 0.3)' 
                                            : 'rgba(103, 58, 183, 0.15)',
                                          cursor: 'pointer'
                                        },
                                        transition: 'all 0.2s ease',
                                      }}
                                    />
                                  ));
                                }
                                return null;
                              })}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </Paper>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ 
              p: { xs: 2, sm: 2.5 },
              pt: { xs: 1.5, sm: 2 },
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              display: 'flex',
              flexDirection: isExtraSmall ? 'column' : 'row', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.5,
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.08), rgba(156, 39, 176, 0.05))' 
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.03), rgba(156, 39, 176, 0.02))',
              flexWrap: 'wrap',
            }}
          >
            <Box component={motion.div} variants={fadeIn} initial="hidden" animate="visible">
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRegenerate();
                }}
                disabled={isRegenerating || !canRegenerate}
                variant="contained"
                startIcon={isRegenerating ? <CircularProgress size={isMobile ? 16 : 18} thickness={5} /> : <MdRefresh size={isMobile ? 14 : 16} />}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : '#333',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  minWidth: isExtraSmall ? '100%' : 'auto',
                  '&:hover': {
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  },
                  '&.Mui-disabled': {
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  },
                  m: 0.5,
                }}
              >
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </Box>
            
            <Box component={motion.div} variants={fadeIn} initial="hidden" animate="visible">
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopyCaption(e);
                }}
                variant="contained"
                startIcon={copiedToClipboard ? <FaCheck size={isMobile ? 12 : 14} /> : <FaCopy size={isMobile ? 12 : 14} />}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  background: copiedToClipboard
                    ? 'linear-gradient(135deg, #00c853, #4caf50)'
                    : 'linear-gradient(135deg, #673ab7, #9c27b0)',
                  color: 'white',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  minWidth: isExtraSmall ? '100%' : 'auto',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    background: copiedToClipboard
                      ? 'linear-gradient(135deg, #4caf50, #00c853)'
                      : 'linear-gradient(135deg, #9c27b0, #673ab7)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                  },
                  m: 0.5,
                }}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Content'}
              </Button>
            </Box>
            
            <Box component={motion.div} variants={fadeIn} initial="hidden" animate="visible">
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreateFlyer(e);
                }}
                variant="contained"
                startIcon={<FaImage size={isMobile ? 12 : 14} />}
                endIcon={<FaArrowRight size={isMobile ? 10 : 12} />}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #673ab7, #9c27b0, #e91e63)',
                  color: 'white',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  minWidth: isExtraSmall ? '100%' : 'auto',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e91e63, #9c27b0, #673ab7)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  },
                  m: 0.5,
                }}
              >
                Create Flyer
              </Button>
            </Box>
            
            <Box component={motion.div} variants={fadeIn} initial="hidden" animate="visible">
              <Button
                component={motion.button}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePublishContent(e);
                }}
                variant="contained"
                startIcon={<FaShare size={isMobile ? 12 : 14} />}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4267B2, #5B7BD5, #00B2FF)',
                  color: 'white',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  minWidth: isExtraSmall ? '100%' : 'auto',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00B2FF, #5B7BD5, #4267B2)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  },
                  m: 0.5,
                }}
              >
                Publish Content
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ResultDialog; 