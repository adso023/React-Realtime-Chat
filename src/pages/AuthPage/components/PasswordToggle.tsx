import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";

interface PasswordToggleProps {
  onToggle: (value: boolean) => void;
}

export const PasswordToggle = (props: PasswordToggleProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <InputAdornment position="end">
      <IconButton
        onClick={() => {
          props.onToggle(!visible);
          setVisible(!visible);
        }}
      >
        {visible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
};
