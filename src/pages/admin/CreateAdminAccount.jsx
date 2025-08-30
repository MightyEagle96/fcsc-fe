import React, { useState } from "react";
import { appLogo } from "../../assets/appTheme";
import { Button, TextField, Typography } from "@mui/material";

function CreateAdminAccount() {
  const [userData, setUserData] = useState({});

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <div className="container pt-5 pb-5">
        <div className="mb-5">
          <Typography
            variant="h5"
            textTransform={"uppercase"}
            fontWeight={700}
            color="#3F7D58"
          >
            Create Admin Account
          </Typography>
        </div>

        <form>
          <div className="row">
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="number"
                  name="phone"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Passowrd"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField fullWidth label="Confirm Password" type="password" />
              </div>
            </div>
            <div className="col-lg-4">
              <Button variant="contained" color="error">
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAdminAccount;
