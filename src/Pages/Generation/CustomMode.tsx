import React from 'react';
import { 
  Box, Typography, TextField, Button, Grid, FormControl, Select, MenuItem,
  IconButton, Tooltip, FormControlLabel, Switch, CircularProgress
} from '@mui/material';
import { 
  FaMagic, FaInfoCircle
} from 'react-icons/fa';
import { useMediaQuery } from '@mui/material';

// Define the necessary types imported from Generation.tsx
type PostType = 'promotional' | 'engagement' | 'testimonial' | 'event' | 'product-launch' | 'custom';
type BusinessType = 'restaurant' | 'computer-shop' | 'clothing' | 'coffee-shop' | 'custom';

interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'select' | 'multiline';
  options?: { value: string; label: string; }[];
  required?: boolean;
  tooltip?: string;
  multiline?: boolean;
  rows?: number;
  dependsOn?: { field: string; value: string; };
}

interface FormErrors {
  [key: string]: string;
}

interface CustomModeProps {
  formState: any;
  formErrors: FormErrors;
  POST_TYPES: Array<{ value: PostType; label: string }>;
  BUSINESS_TYPES: Array<{ value: BusinessType; label: string }>;
  FORM_FIELDS: { [key in PostType]: FormField[] };
  handleChange: (field: string, value: any) => void;
  handlePostTypeChange: (type: PostType) => void;
  handleBusinessTypeChange: (type: BusinessType) => void;
  handleGenerate: () => void;
  isDarkMode: boolean;
  isGenerating: boolean;
  darkModeMenuProps: any;
}

const CustomMode: React.FC<CustomModeProps> = ({
  formState,
  formErrors,
  POST_TYPES,
  BUSINESS_TYPES,
  FORM_FIELDS,
  handleChange,
  handlePostTypeChange,
  handleBusinessTypeChange,
  handleGenerate,
  isDarkMode,
  isGenerating,
  darkModeMenuProps
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Box sx={{ mb: { xs: 1.5, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            mb: { xs: 0.75, sm: 1.5 },
            color: isDarkMode ? '#fff' : '#000',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}
        >
          Choose Your Post Type
        </Typography>
          
        <Grid container spacing={isMobile ? 0.75 : 1.5} alignItems="center">
          {POST_TYPES.map((type) => (
            <Grid 
              item 
              xs={6}
              sm={formState.postType ? 6 : 4} 
              md={formState.postType ? 6 : 4}
              key={type.value} 
              sx={{ 
                display: formState.postType && formState.postType !== type.value ? 'none' : 'block',
                transition: 'all 0.3s ease'
              }}
            >
              {formState.postType === type.value ? (
                <FormControl fullWidth>
                  <Select
                    value={formState.postType}
                    onChange={(e) => handlePostTypeChange(e.target.value as PostType)}
                    MenuProps={darkModeMenuProps}
                    sx={{
                      py: 1.2,
                      px: 1.5,
                      height: '48px',
                      borderRadius: 1.5,
                      background: isDarkMode 
                        ? 'linear-gradient(45deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2), rgba(131,58,180,0.2))'
                        : 'linear-gradient(45deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1), rgba(131,58,180,0.1))',
                      border: `1px solid ${
                        isDarkMode
                          ? 'rgba(64,93,230,0.5)'
                          : 'rgba(64,93,230,0.3)'
                      }`,
                      color: isDarkMode ? '#fff' : '#000',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover': {
                        background: isDarkMode 
                          ? 'linear-gradient(45deg, rgba(64,93,230,0.3), rgba(88,81,219,0.3), rgba(131,58,180,0.3))'
                          : 'linear-gradient(45deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2), rgba(131,58,180,0.2))',
                      },
                      '& .MuiSelect-select': {
                        py: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                      },
                    }}
                  >
                    {POST_TYPES.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        sx={{
                          py: 1.2,
                          px: 1.5,
                          '&:hover': {
                            background: isDarkMode 
                              ? 'rgba(64,93,230,0.1)'
                              : 'rgba(64,93,230,0.05)',
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.9rem',
                          }}
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handlePostTypeChange(type.value as PostType)}
                  sx={{ 
                    py: 1.2,
                    px: 0.75,
                    height: '48px',
                    borderRadius: 1.5,
                    border: `1px solid ${
                      isDarkMode
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)'
                    }`,
                    color: isDarkMode ? '#fff' : '#000',
                    '&:hover': {
                      background: isDarkMode
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      borderColor: isDarkMode
                        ? 'rgba(64,93,230,0.8)'
                        : 'rgba(64,93,230,0.5)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' }
                    }}
                  >
                    {type.label}
                  </Typography>
                </Button>
              )}
            </Grid>
          ))}

          {/* Business Type Selection */}
          {formState.postType && (
            <Grid item xs={6} sm={6} md={6}>
              <FormControl fullWidth>
                <Select
                  value={formState.businessType}
                  onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
                  displayEmpty
                  MenuProps={darkModeMenuProps}
                  sx={{
                    height: '48px',
                    borderRadius: 1.5,
                    background: isDarkMode 
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.8)',
                    color: isDarkMode ? '#fff' : '#000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                    '& .MuiSelect-select': {
                      py: 0,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.9rem',
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.9rem' }}>
                        Business Type
                      </Typography>;
                    }
                    return BUSINESS_TYPES.find(type => type.value === selected)?.label || selected;
                  }}
                >
                  {BUSINESS_TYPES.map((type) => (
                    <MenuItem 
                      key={type.value} 
                      value={type.value}
                      sx={{
                        py: 1.2,
                        px: 1.5,
                        fontSize: '0.9rem',
                      }}
                    >
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.businessType && (
                  <Typography color="error" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                    {formErrors.businessType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          )}
        </Grid>

        {/* Custom Business Type Input */}
        {formState.businessType === 'custom' && (
          <Box sx={{ 
            mt: 2, 
            width: '100%',
            px: 1
          }}>
            <TextField
              fullWidth
              label="Custom Business Type"
              placeholder="Enter your business type"
              value={formState.customBusinessType || ''}
              onChange={(e) => handleChange('customBusinessType', e.target.value)}
              size="small"
              error={!!formErrors.customBusinessType}
              helperText={formErrors.customBusinessType}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? 'rgba(131, 58, 180, 0.6)' : 'rgba(131, 58, 180, 0.6)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
              }}
            />
          </Box>
        )}
      </Box>

      {formState.postType && (
        <Box>
          {/* Form Fields Section - Rendered in a 2x2 grid */}
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {FORM_FIELDS[formState.postType as PostType]
              .filter((field: FormField) => {
                // Show field if it doesn't depend on another field, or if its dependency is satisfied
                if (!field.dependsOn) return true;
                return formState[field.dependsOn.field] === field.dependsOn.value;
              })
              .map((field: FormField) => (
                <Grid item xs={12} md={field.id === 'description' ? 12 : 6} key={field.id}>
                  <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: { xs: 0.5, sm: 1 }, 
                      flexWrap: 'wrap' // Allow wrapping on very small screens
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mr: 1, 
                          fontWeight: 500, 
                          color: isDarkMode ? '#fff' : '#000',
                          fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller text on mobile
                        }}
                      >
                        {field.label}
                      </Typography>
                      {field.tooltip && (
                        <Tooltip title={field.tooltip}>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                              padding: { xs: 0.1, sm: 0.2 }, // Smaller padding on mobile
                              '&:hover': {
                                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              }
                            }}
                          >
                            <FaInfoCircle size={isMobile ? 12 : 14} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    {field.type === 'select' ? (
                      <FormControl fullWidth error={!!formErrors[field.id]} size="small">
                        <Select
                          value={formState[field.id] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          MenuProps={darkModeMenuProps}
                          renderValue={(selected: string) => {
                            const option = field.options?.find(opt => opt.value === selected);
                            return option ? option.label : '';
                          }}
                          sx={{
                            color: isDarkMode ? '#fff' : '#000',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px 14px',
                            }
                          }}
                        >
                          {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors[field.id] && (
                          <Typography color="error" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                            {formErrors[field.id]}
                          </Typography>
                        )}
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        placeholder={field.placeholder}
                        value={formState[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        error={!!formErrors[field.id]}
                        helperText={formErrors[field.id]}
                        multiline={field.multiline}
                        rows={field.rows || 1}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: isDarkMode ? '#fff' : '#000',
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'transparent',
                            '& fieldset': {
                              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          },
                          '& .MuiInputBase-input': {
                            color: isDarkMode ? '#fff' : '#000',
                          },
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
          </Grid>

          {/* Generation Options */}
          <Box 
            sx={{ 
              mt: 3, 
              p: 2,
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '8px',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Typography sx={{ mb: 2, fontWeight: 600 }}>Options</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.includeHashtags}
                      onChange={(e) => handleChange('includeHashtags', e.target.checked)}
                    />
                  }
                  label="Include Hashtags"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.includeEmojis}
                      onChange={(e) => handleChange('includeEmojis', e.target.checked)}
                    />
                  }
                  label="Include Emojis"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Generation button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              disabled={isGenerating}
              onClick={handleGenerate}
              startIcon={isGenerating ? 
                <CircularProgress size={20} color="inherit" /> : 
                <FaMagic size={20} />
              }
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 8,
                background: isDarkMode ? 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)' : 'linear-gradient(to right, #a14eea, #327dff)',
                boxShadow: isDarkMode ? '0 4px 15px rgba(64,93,230,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  background: isDarkMode ? 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)' : 'linear-gradient(to right, #a14eea, #327dff)',
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode ? '0 6px 20px rgba(64,93,230,0.4)' : '0 6px 20px rgba(0,0,0,0.2)',
                },
                '&.Mui-disabled': {
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Caption'}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CustomMode; 