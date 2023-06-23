import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  activateUser,
  deActivateUser,
  setPageNo,
  setUserFindQuery,
  setUsers,
} from "../../redux/actions";
import axios from "axios";
import "./userTable.css"; // Import the CSS file for table styling
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function UserTable() {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.userManagementReducer.users);
  const userManagementQuery = useSelector(
    (state) => state.userManagementReducer.query
  );
  const totalCount = useSelector(
    (state) => state.userManagementReducer.totalCount
  );
  const pageNo = useSelector((state) => state.userManagementReducer.page);
  const handleActivate = (userId) => {
    Swal.fire({
      title: "Activate User",
      text: "Are you sure you want to activate this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Activate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(activateUser(userId));
        try {
          const token = localStorage.getItem("token");
          const userUpdationApi = await axios.post(
            "http://localhost:8070/api/user/update-user-status",
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userUpdationApi.status === 200) {
            Swal.fire("User Activated!", "", "success");
          }
        } catch (error) {
          Swal.fire("Error occurred", "", "error");
        }
      }
    });
  };

  const handleDeactivate = (userId) => {
    Swal.fire({
      title: "Deactivate User",
      text: "Are you sure you want to deactivate this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Deactivate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deActivateUser(userId));
        try {
          const token = localStorage.getItem("token");
          const userUpdationApi = await axios.post(
            "http://localhost:8070/api/user/update-user-status",
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userUpdationApi.status === 200) {
            Swal.fire("User Deactivated!", "", "success");
          }
        } catch (error) {
          Swal.fire("Error occurred", "", "error");
        }
      }
    });
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    // Construct the updated query object
    const updatedQuery = {
      ...userManagementQuery,
      [name]: value === "false" ? false : value === "true" ? true : value,
    };
    dispatch(setUserFindQuery(updatedQuery));
    // Dispatch the setUserQuery action with the updated query object
  };

  const handleUserSearch = async (query) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const queryData = await axios.post(
        `http://localhost:8070/api/user/users-data`,
        {
          isActive: query?.active,
          isVerified: query?.verified,
          email: query?.email,
          sortBy: query?.sort,
          pageNo: pageNo, // Add pageNo parameter
          rowsPerPage: 5,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (queryData.status === 200) {
        console.log(29);
        dispatch(setUsers(queryData.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(setUsers({ users: [] }));
    }
  };

  useEffect(() => {
    // Call the handleUserSearch function with the initial query
    handleUserSearch(userManagementQuery);
  }, [pageNo,userManagementQuery]); // Execute the effect whenever the pageNo changes

  const handlePageChange = (event, value) => {
    dispatch(setPageNo(value));
  };

  return (
    <>
      {allUsers.length > 0 ? (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="text"
                    name="email"
                    onChange={handleQueryChange}
                    placeholder="search here"
                  />
                </th>
                <th>
                  <select name="active" onChange={handleQueryChange}>
                    <option value="">Select Active</option>
                    <option value={true}>isActive</option>
                    <option value={false}>isUnActive</option>
                  </select>
                </th>
                <th>
                  <select name="verified" onChange={handleQueryChange}>
                    <option value="">Select Verified</option>
                    <option value={true}>isVerified</option>
                    <option value={false}>isUnVerified</option>
                  </select>
                </th>
                <th>
                  <select name="sort" onChange={handleQueryChange}>
                    <option value="">Select Sorting</option>
                    <option value="ASC">Ascending</option>
                    <option value="DES">Descending</option>
                  </select>
                </th>
                <th>
                  <Button onClick={() => handleUserSearch(userManagementQuery)}>
                    Search
                  </Button>
                </th>
              </tr>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Is Verified</th>
                <th>Is Active</th>
                <th>Last Login At</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.email}</td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td>
                    {user.isActive ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDeactivate(user._id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleActivate(user._id)}
                      >
                        Activate
                      </Button>
                    )}
                  </td>
                  <td>{user?.lastLoginAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {console.log(totalCount)}
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalCount / 5)}
              page={pageNo}
              onChange={handlePageChange}
              rowsPerPage={5}
            />
          </Stack>
        </>
      ) : (
        <h2>No Users to show</h2>
      )}
    </>
  );
}

export default UserTable;