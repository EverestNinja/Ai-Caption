import React from "react";
import {
    Modal,
    Box,
    Paper,
    Typography,
    IconButton,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PopupProps {
    /** Controls whether the popup is visible */
    open: boolean;
    /** Text to display as the title */
    title: string;
    /** Text (or JSX) to display as the message/body */
    message: string | React.ReactNode;
    /** Callback fired when the user clicks the close button or backdrop */
    onClose: () => void;
}

/**
 * A reusable, themed popup/modal component.
 * Renders a centered Paper with a blur‐backdrop.
 * Accepts a custom title and message, and calls onClose when dismissed.
 */
const Popup: React.FC<PopupProps> = ({ open, title, message, onClose }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropProps={{
                sx: {
                    backgroundColor: isDarkMode
                        ? "rgba(0, 0, 0, 0.5)"
                        : "rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: 400 },
                    outline: "none",
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 3,
                        p: { xs: 2, sm: 3 },
                        backgroundColor: isDarkMode
                            ? "rgba(30, 30, 30, 0.9)"
                            : "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                        position: "relative",
                    }}
                >
                    {/* Header Row: Title + Close Button */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: isDarkMode ? "#FFFFFF" : "#111111",
                            }}
                        >
                            {title}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                                "&:hover": {
                                    backgroundColor: isDarkMode
                                        ? "rgba(255,255,255,0.15)"
                                        : "rgba(0,0,0,0.08)",
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Body/Message */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: isDarkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.87)",
                            lineHeight: 1.5,
                        }}
                    >
                        {message}
                    </Typography>
                </Paper>
            </Box>
        </Modal>
    );
};

export default Popup;
