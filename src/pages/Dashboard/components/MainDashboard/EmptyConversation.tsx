import { Container, Typography } from "@mui/material";

export const EmptyConversationContainer = () => {
  return (
    <Container
      style={{
        padding: 0,
        maxWidth: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">No Chat Selected</Typography>
      <Typography variant="body1">
        Click on a conversation on the left to view messages
      </Typography>
    </Container>
  );
};
