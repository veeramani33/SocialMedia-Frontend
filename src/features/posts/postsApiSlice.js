import { apiSlice } from "../../app/api/apiSlice"

export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        AddNewPost: builder.mutation({
            query: initialNote => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        GetPosts: builder.query({
            query: () => ({
                url: '/posts',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: [{ type: 'Post', id: "LIST" }]
        }),
        GetPostDetails: builder.query({
            query: id => ({
                url: `/posts/${id}`, // Endpoint for getting post by ID
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
        }),
    }),
})

export const {
    useAddNewPostMutation,
    useGetPostsQuery,
    useGetPostDetailsQuery
} = postApiSlice
