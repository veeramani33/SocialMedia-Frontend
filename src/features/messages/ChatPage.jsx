// App or any parent component
import React, { useState } from 'react';
import ChatArea from './ChatArea'; // Import ChatArea component

const ChatPage = () => {
  const [userId] = useState('currentUserId'); // Example current user ID
  const [friendId, setFriendId] = useState(null); // Friend ID will be selected dynamically

  const handleFriendSelection = (friendId) => {
    setFriendId(friendId);
  };

  return (
    <div>
      {/* Example list of friends */}
      <button onClick={() => handleFriendSelection('friend1')}>Chat with Friend 1</button>
      <button onClick={() => handleFriendSelection('friend2')}>Chat with Friend 2</button>

      {/* Display Chat Area when friend is selected */}
      {friendId && <ChatArea userId={userId} friendId={friendId} />}
    </div>
  );
};

export default ChatPage;
