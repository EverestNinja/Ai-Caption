// components/UpgradeToProModal.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
    useTheme as muiUseTheme,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

interface UpgradeToProModalProps {
    open: boolean;
    onClose: () => void;
}

const UpgradeToProModal: React.FC<UpgradeToProModalProps> = ({ open, onClose }) => {
    const theme = muiUseTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="upgrade-to-pro-title"
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                },
            }}
        >
            <DialogTitle
                id="upgrade-to-pro-title"
                sx={{
                    m: 0,
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
                }}
            >
                <Typography variant="h6" component="div">
                    Upgrade to Pro
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.text.secondary,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ textAlign: 'center', py: 3 }}>
                <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    color="text.primary"
                    gutterBottom
                >
                    Unlock premium features, advanced analytics, and priority support by upgrading to Pro.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gain unlimited access to all styles, batch exports, and exclusive content—take your experience to the next level.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Link to="/pricing">
                    <Button
                        component="a"
                        fullWidth
                        sx={{
                            maxWidth: 260,
                            py: 1.5,
                            px: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            fontSize: '1rem',
                            color: '#fff',
                            textTransform: 'none',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            },
                        }}
                    >
                        Upgrade to Pro
                    </Button>
                </Link>
            </DialogActions>
        </Dialog>
    );
};

export default UpgradeToProModal;
