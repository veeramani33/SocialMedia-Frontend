import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

// Create an entity adapter for messages
const messagesAdapter = createEntityAdapter({});

const initialState = messagesAdapter.getInitialState();

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch messages between users
    getMessages: builder.query({
        query: ({ userId, friendId }) => ({
          url: '/messages',
          params: { userId, friendId }, // Passing userId and friendId as query params
        }),
        transformResponse: (responseData) => {
          // Simply return the messages array as it is from the backend
          return responseData.messages || []; // Return as an array of messages
        },
        providesTags: (result) => {
          // Adjusting the tag to handle the array format
          return result && result.length
            ? [
                { type: 'Message', id: 'LIST' },
                ...result.map((message) => ({ type: 'Message', id: message._id })),
              ]
            : [{ type: 'Message', id: 'LIST' }];
        },
      }),
      

    // Send a new message
    sendMessage: builder.mutation({
      query: ({ senderId, receiverId, content }) => ({
        url: '/messages',
        method: 'POST',
        body: { senderId, receiverId, content },
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
} = messageApiSlice;

// Selectors for accessing message data from the Redux store
const selectMessagesResult = messageApiSlice.endpoints.getMessages.select();

const selectMessagesData = createSelector(
  selectMessagesResult,
  (messagesResult) => messagesResult.data
);

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
} = messagesAdapter.getSelectors((state) => selectMessagesData(state) ?? initialState);
