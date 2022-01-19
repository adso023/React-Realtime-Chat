import { DeleteForever } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { storage } from "../../../firebase/clientApp";

interface ProfilePickerProps {
  onClick: (url: string | null) => void;
}

export const ProfilePicker = (props: ProfilePickerProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const templateCallback = useCallback(async () => {
    if (!localStorage.getItem("template_url")) {
      const templateRef = ref(storage, "template/profile_placeholder.png");
      const url = await getDownloadURL(templateRef);
      setDownloadUrl(url);
    } else {
      setDownloadUrl(localStorage.getItem("template_url"));
    }
  }, []);

  useEffect(() => {
    templateCallback();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.onClick(downloadUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadUrl]);

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", position: "relative" }}
    >
      {downloadUrl && file && (
        <Tooltip title="Delete profile image">
          <IconButton
            style={{
              position: "absolute",
              top: 0,
              left: "55%",
              zIndex: 1000,
            }}
            onClick={async () => {
              const deleteRef = ref(storage, `profile/${file?.name}`);
              await deleteObject(deleteRef);
              setFile(null);
              await templateCallback();
            }}
          >
            <DeleteForever />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={"Click to change profile image"}>
        <IconButton
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          {!downloadUrl && (
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 20,
              }}
            >
              Profile Image
            </Avatar>
          )}
          {downloadUrl && (
            <Avatar
              src={downloadUrl}
              sx={{ width: 100, height: 100, fontSize: 30 }}
            />
          )}
          <input
            ref={fileRef}
            type="file"
            id="profileSelector"
            style={{ display: "none" }}
            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.length !== 0) {
                setFile(e.target.files![0]);
                try {
                  const uploadRef = ref(
                    storage,
                    `profile/${e.target.files![0].name}`
                  );
                  const uploadTask = await uploadBytes(
                    uploadRef,
                    e.target.files![0],
                    {
                      contentType: e.target.files![0].type,
                    }
                  );
                  const url = await getDownloadURL(uploadTask.ref);
                  setDownloadUrl(url);
                } catch (e) {
                  console.log(e);
                }
              } else {
                console.log("Nothing selected");
              }
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
