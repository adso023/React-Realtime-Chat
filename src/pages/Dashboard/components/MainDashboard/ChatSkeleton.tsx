import { Card, CardHeader, Skeleton, Divider } from "@mui/material";

export const ChatSkeleton = () => {
  return (
    <Card style={{ maxWidth: 345, margin: 2 }}>
      <div style={{ margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
      <div style={{ maxWidth: "100vw", margin: 2 }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          }
          title={<Skeleton variant="rectangular"></Skeleton>}
          subheader={
            <Skeleton
              className="mt-2"
              variant="rectangular"
              height={20}
            ></Skeleton>
          }
        ></CardHeader>
        <Divider className="mx-2"></Divider>
      </div>
    </Card>
  );
};
