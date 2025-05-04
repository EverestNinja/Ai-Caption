import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, IconButton, Button, Paper, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FaMagic, FaCopy, FaTimes, FaCheck, 
  FaImage, FaShare 
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          borderRadius: { xs: '12px', sm: '16px' },
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
          maxWidth: { xs: '95%', sm: '600px' },
          margin: { xs: '10px', sm: '20px' },
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          pb: { xs: 1, sm: 2 },
          pt: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2))' 
            : 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaMagic size={isMobile ? 16 : 20} color={isDarkMode ? '#fff' : '#000'} />
          <Typography
            variant="h5" 
            sx={{
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            Generated Content
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: isDarkMode ? '#fff' : '#000',
            '&:hover': {
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <FaTimes size={isMobile ? 16 : 24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            borderRadius: { xs: '8px', sm: '12px' },
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Box
            sx={{
              maxHeight: { xs: '50vh', sm: '60vh' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: { xs: '6px', sm: '8px' },
              },
              '&::-webkit-scrollbar-track': {
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                '&:hover': {
                  background: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
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
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mb: { xs: 2, sm: 3 },
                    background: index === selectedCaptionIndex
                      ? isDarkMode 
                        ? 'rgba(64, 93, 230, 0.1)'
                        : 'rgba(64, 93, 230, 0.05)'
                      : isDarkMode 
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: { xs: '8px', sm: '12px' },
                    border: `1px solid ${index === selectedCaptionIndex 
                      ? isDarkMode ? 'rgba(64, 93, 230, 0.3)' : 'rgba(64, 93, 230, 0.2)'
                      : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      background: isDarkMode 
                        ? 'rgba(64, 93, 230, 0.08)'
                        : 'rgba(64, 93, 230, 0.03)',
                      borderColor: isDarkMode 
                        ? 'rgba(64, 93, 230, 0.25)'
                        : 'rgba(64, 93, 230, 0.15)',
                    },
                  }}
                  onClick={() => setSelectedCaptionIndex(index)}
                >
                  {/* Caption header with number and copy button */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: { xs: 1, sm: 2 }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box 
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: `2px solid ${index === selectedCaptionIndex 
                            ? '#405DE6' 
                            : isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {index === selectedCaptionIndex && (
                          <Box 
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: '#405DE6',
                            }}
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        Caption {index + 1}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCaption(e, index);
                      }}
                      size="small"
                      sx={{
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        padding: { xs: '4px', sm: '8px' },
                        '&:hover': {
                          color: isDarkMode ? '#fff' : '#000',
                        },
                      }}
                    >
                      <FaCopy size={isMobile ? 14 : 16} />
                    </IconButton>
                  </Box>
                  {/* Caption text */}
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      color: isDarkMode ? '#fff' : '#000',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
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
                      mt: { xs: 1.5, sm: 2 },
                      pt: { xs: 1.5, sm: 2 },
                      borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                          fontFamily: '"Inter", sans-serif',
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          lineHeight: 1.8,
                        }}
                      >
                        {caption.text.split('\n\n').map((part, partIndex) => {
                          if (part.startsWith('#')) {
                            return part.split(' ').map((tag, i) => (
                              <Chip
                                key={`${partIndex}-${i}`}
                                label={tag}
                                size="small"
                                sx={{
                                  m: { xs: 0.3, sm: 0.5 },
                                  background: isDarkMode 
                                    ? 'rgba(64,93,230,0.2)' 
                                    : 'rgba(64,93,230,0.1)',
                                  color: isDarkMode ? '#fff' : '#000',
                                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                  height: { xs: '24px', sm: '32px' },
                                  '&:hover': {
                                    background: isDarkMode 
                                      ? 'rgba(64,93,230,0.3)' 
                                      : 'rgba(64,93,230,0.2)',
                                    cursor: 'pointer'
                                  },
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
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: { xs: 2, sm: 3 },
          pt: { xs: 1, sm: 2 },
          borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          display: 'flex',
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))' 
            : 'linear-gradient(135deg, rgba(64,93,230,0.05), rgba(88,81,219,0.05))',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRegenerate();
          }}
          disabled={isRegenerating || !canRegenerate}
          variant="contained"
          startIcon={isRegenerating ? <CircularProgress size={isMobile ? 16 : 20} /> : <MdRefresh size={isMobile ? 14 : 18} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #757575, #9E9E9E, #BDBDBD)',
            color: 'white',
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #616161, #757575, #9E9E9E)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            '&.Mui-disabled': {
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
            m: 0.5,
          }}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
        
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyCaption(e);
          }}
          variant="contained"
          startIcon={copiedToClipboard ? <FaCheck size={isMobile ? 12 : 14} /> : <FaCopy size={isMobile ? 12 : 14} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            background: copiedToClipboard
              ? 'linear-gradient(45deg, #00c853, #00e676)'
              : 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
            color: 'white',
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: copiedToClipboard
                ? 'linear-gradient(45deg, #00e676, #00c853)'
                : 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            m: 0.5,
          }}
        >
          {copiedToClipboard ? 'Copied!' : 'Copy Content'}
        </Button>
        
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCreateFlyer(e);
          }}
          variant="contained"
          startIcon={<FaImage size={isMobile ? 12 : 14} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
            color: 'white',
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'background 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          }}
        >
          Create Flyer
        </Button>
        
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePublishContent(e);
          }}
          variant="contained"
          startIcon={<FaShare size={isMobile ? 12 : 14} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #4267B2, #5B7BD5, #00B2FF)',
            color: 'white',
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #00B2FF, #5B7BD5, #4267B2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            m: 0.5,
          }}
        >
          Publish Content
        </Button>
        
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          variant="contained"
          startIcon={<FaTimes size={isMobile ? 12 : 14} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #F44336, #E57373, #EF9A9A)',
            color: 'white',
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #EF9A9A, #E57373, #F44336)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            m: 0.5,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultDialog; 