import { Person } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

interface TopBarProps {
  title: string;
  altTitle: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const TopBar = (props: TopBarProps) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5">{props.title}</Typography>
          </Box>
          <Tooltip title={props.altTitle}>
            <IconButton onClick={props.onClick}>
              <Avatar>
                <Person />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
