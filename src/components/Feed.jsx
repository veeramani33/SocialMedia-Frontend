import { Box, Stack, Skeleton, Typography, Card, CardContent, CardMedia, Avatar } from "@mui/material";
import React from "react";
import { useGetPostsQuery } from "../features/posts/postsApiSlice";  // Ensure you're using the correct hook

const Feed = () => {
  const { data: response, isLoading, isError, error } = useGetPostsQuery();

  if (isLoading) {
    return (
      <Stack spacing={1}>
        <Skeleton variant="text" height={100} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="rectangular" height={300} />
      </Stack>
    );
  }

  if (isError) {
    return <div>Error loading posts: {error.message}</div>;
  }

  const posts = response?.posts || [];  // Ensure you're accessing the posts array from the response

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  const renderMedia = (media) => {
    if (!media || media.length === 0) return null;

    // Check if it's an image or video based on file extension
    const file = media[0]; // Assume the first item in the array is the media (adjust if needed)
    
    // Check if the file is an image
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
    // Check if the file is a video
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file);

    if (isImage) {
      return <CardMedia component="img" height="300" image={file} alt="Post media" />;
    } else if (isVideo) {
      return (
        <video width="100%" controls>
          <source src={file} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  return (
    <Box flex={4} p={{ xs: 0, md: 2 }}>
      {posts.map((post) => (
        <Card key={post._id} sx={{ marginBottom: 2 }}>
          <CardContent>
            {/* Render user profile picture and username */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={post.userId.profilePicture} alt={post.userId.name}/>
              <Typography variant="h6">{post.userId.name}</Typography>
            </Stack>

            {/* Render post text */}
            {post.content.text ? (
              <Typography variant="body1" component="p">
                {post.content.text}
              </Typography>
            ) : (
              <Typography variant="body2" component="p" color="textSecondary">
                No text available
              </Typography>
            )}

            {/* Render post media */}
            {renderMedia(post.content.media)}

            {/* Render date/time of posting */}
            <Typography variant="body2" color="textSecondary" mt={2}>
              Posted on {post.formattedDate}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
