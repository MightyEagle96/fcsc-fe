import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateAdminAccount() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    console.log(userData);

    const { data, error } = httpService.post("admin/singup", userData);

    if (data) {
      navigate("/admin/login");
      // window.location.href = "/";
    }
    if (error) {
      toast.error(error);
    }
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

        <form onSubmit={login}>
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
              <Button
                type="submit"
                variant="contained"
                color="error"
                loading={loading}
              >
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
