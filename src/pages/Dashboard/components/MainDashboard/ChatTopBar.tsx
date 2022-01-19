import { Person } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  CircularProgress,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DocumentData } from "firebase/firestore";

interface ChatTopBarProps {
  title: string;
  authLoading: boolean;
  userInfoLoading: boolean;
  userInfo?: DocumentData | null;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const ChatTopBar = (props: ChatTopBarProps) => {
  const { authLoading, userInfoLoading, userInfo } = props;
  return (
    <Box width={"100vw"}>
      <AppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5">{props.title}</Typography>
          </Box>
          {!authLoading && !authLoading && userInfo && (
            <Tooltip
              title={
                <Typography variant="subtitle1">{`${userInfo["username"]} - Account Options`}</Typography>
              }
            >
              <IconButton onClick={props.onClick}>
                {userInfo["profile_image"] && (
                  <Avatar src={userInfo["profile_image"]} />
                )}
                {!userInfo["profile_image"] && (
                  <Avatar>
                    <Person />
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
          )}
          {(authLoading || userInfoLoading) && (
            <Tooltip
              title={
                <Typography variant="subtitle1">Loading Account</Typography>
              }
            >
              <CircularProgress color="secondary" />
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
