import { apiSlice } from "../../app/api/apiSlice";


export const friendsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriendRequests: builder.query({
        query: (userId) => `/friends/requests/${userId}`, // API endpoint to fetch friend requests for a user
        providesTags: (result) => 
          result ? result.map(({ id }) => ({ type: 'FriendRequests', id })) : [{ type: 'FriendRequests', id: 'LIST' }],
      }),
    getNotFriendList: builder.query({
        query: (userId) => `/friends/notfriends/${userId}`, // API endpoint to fetch friend requests for a user
        providesTags: (result) => 
          result ? result.map(({ id }) => ({ type: 'FriendRequests', id })) : [{ type: 'FriendRequests', id: 'LIST' }],
     }),
    sendFriendRequest: builder.mutation({
      query: ({ requesterId, recipientId }) => ({
        url: "/friends",
        method: "POST",
        body: { requesterId, recipientId },
      }),
    }),
    acceptFriendRequest: builder.mutation({
      query: ({ requesterId, recipientId }) => ({
        url: "/friends",
        method: "PATCH",
        body: { requesterId, recipientId },
      }),
    }),
  }),
});

export const {
  useGetFriendRequestsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useGetNotFriendListQuery
} = friendsApiSlice;

