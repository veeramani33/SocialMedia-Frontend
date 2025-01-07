import {
  Avatar,
  Button,
  ButtonGroup,
  Fab,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Add as AddIcon,
  DateRange,
  EmojiEmotions,
  Image,
  PersonAdd,
  VideoCameraBack,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import TagUser from "./TagUser";
import { useAddNewPostMutation } from "../features/posts/postsApiSlice"; // Import the mutation hook

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

const Add = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(""); // State for post text
  const [media, setMedia] = useState(""); // State for media URL
  const [tags, setTags] = useState([]); // State for tags (optional)
  const [tagOpen, setTagOpen] = useState(false); 
  const [userId, setUserId] = useState(null); // Replace with the logged-in user's ID
  const [addNewPost, { isLoading, error }] = useAddNewPostMutation(); // Mutation hook

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserId(userId);
    } else {
      alert("User ID not found in localStorage");
    }
  }, []);
  
  const handleAddTag = (id) => {
    setTags((prevTags) => [...prevTags, id]); // Add selected user ID to tags
    setTagOpen(false); // Close the tag UI
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:3500/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        return `http://localhost:3500${data.url}`; // Use full URL
      } else {
        throw new Error(data.message || "File upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("File upload failed. Please try again.");
    }
  };
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadFile(file);
      if (url) {
        setMedia(url); // Update the media state with the uploaded file's URL
      }
    }
  };

  const handlePost = async () => {
    try {
      await addNewPost({ userId, text, media, tags }).unwrap();
      setOpen(false); // Close modal after posting
      setText(""); // Reset text
      setMedia(""); // Reset media
      setTags([]); // Reset tags
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="Post"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <SytledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height={tagOpen ? 400 : 280}
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          {!tagOpen ? (
            <>
              <Typography variant="h6" color="gray" textAlign="center">
                Create post
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                id="standard-multiline-static"
                multiline
                rows={3}
                placeholder="What's on your mind?"
                variant="standard"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Stack direction="row" gap={1} mt={2} mb={3}>
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Button component="span">
                    <Image color="secondary" />
                  </Button>
                </label>
                <Button onClick={() => setTagOpen(true)}>Tag Users</Button>
              </Stack>
              <ButtonGroup
                fullWidth
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button onClick={handlePost} disabled={isLoading}>
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <TagUser onAddTag={handleAddTag} />
          )}
          {error && (
            <Typography color="error" variant="body2" textAlign="center" mt={2}>
              {error.message}
            </Typography>
          )}
        </Box>
      </SytledModal>
    </>
  );
};

export default Add;
