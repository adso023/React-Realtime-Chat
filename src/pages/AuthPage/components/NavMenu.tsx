import { Link, Menu, MenuItem } from "@mui/material";

interface NavMenuProps {
  anchorPoint: HTMLElement | null;
  route?: string;
  title?: string;
  onCloseClick?: () => void;
}

export const NavMenu = (props: NavMenuProps) => {
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
      <MenuItem>
        <Link href={props.route}>{props.title}</Link>
      </MenuItem>
    </Menu>
  );
};
