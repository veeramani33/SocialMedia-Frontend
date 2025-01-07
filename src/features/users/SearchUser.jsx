import React, { useState } from "react";
import { useSearchUsersQuery } from "./usersApiSlice";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, isLoading, isError, error } = useSearchUsersQuery(searchTerm, {
    skip: !searchTerm, // Skip query if searchTerm is empty
  });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value.trim());
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          padding: "10px",
          width: "400px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>{error?.data?.message || "Error fetching users"}</p>}
        {!searchTerm}
        {searchTerm && users?.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={user.profilePicture || "default-avatar.png"}
                  alt={user.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span >{user.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          searchTerm && !isLoading && <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
