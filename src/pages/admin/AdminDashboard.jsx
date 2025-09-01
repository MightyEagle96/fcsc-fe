import React from "react";
import { useAppUser } from "../../contexts/AppUserContext";
import { Typography } from "@mui/material";

function AdminDashboard() {
  const { user } = useAppUser();

  console.log(user);
  return (
    <div className="mb-5">
      <div
        className="d-flex align-items-center"
        style={{ backgroundColor: "#26667F", color: "#fff", minHeight: "30vh" }}
      >
        <div className="container w-100">
          <div className="row">
            <div className="col-lg-3">
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Welcome Back,
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Total Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                9,000
              </Typography>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Verified Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                9,000
              </Typography>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Unverified Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                9,000
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
