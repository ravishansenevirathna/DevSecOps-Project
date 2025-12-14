import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

interface PlayButtonProps extends ButtonProps {
  videoKey?: string;
  title?: string;
  overview?: string;
}

export default function PlayButton({ sx, videoKey, title, overview, onClick, ...others }: PlayButtonProps) {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    } else if (videoKey) {
      // Navigate with video data in state
      navigate(`/${MAIN_PATH.watch}`, {
        state: { videoKey, title, overview }
      });
    } else {
      // Fallback to just navigating without data
      navigate(`/${MAIN_PATH.watch}`);
    }
  };

  return (
    <Button
      color="inherit"
      variant="contained"
      startIcon={
        <PlayArrowIcon
          sx={{
            fontSize: {
              xs: "24px !important",
              sm: "32px !important",
              md: "40px !important",
            },
          }}
        />
      }
      {...others}
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        fontSize: { xs: 18, sm: 24, md: 28 },
        lineHeight: 1.5,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        ...sx,
      }}
      onClick={handleClick}
    >
      Play
    </Button>
  );
}
