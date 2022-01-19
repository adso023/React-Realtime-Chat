import { AccountBox, Logout } from "@mui/icons-material";
import { Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "../../../../firebase/clientApp";

interface ChatNavMenuProps {
  anchorPoint: HTMLElement | null;
  userInfo?: DocumentData | null;
  onCloseClick?: () => void;
  onLogOutClick: () => void;
}

export const ChatNavMenu = (props: ChatNavMenuProps) => {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  return (
    <Menu
      anchorEl={props.anchorPoint}
      id="account-menu"
      open={Boolean(props.anchorPoint)}
      onClose={props.onCloseClick}
      onClick={props.onCloseClick}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={() => {
          navigate("/profile", {
            state: { ...props.userInfo, uid: user?.uid },
          });
        }}
      >
        <ListItemIcon>
          <AccountBox />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={props.onLogOutClick}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};
