import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Person } from "@mui/icons-material";
import Swal from "sweetalert2";

function CreateAdminAccount() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create Account",
      text: "Are you sure you want to create new admin account",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        const { data, error } = await httpService.post(
          "admin/signup",
          userData
        );

        if (data) {
          Swal.fire({
            title: data,
            icon: "success",
            timer: 2000,
          }).then(() => navigate("/admin/login"));
          //
          // window.location.href = "/";
        }
        if (error) {
          toast.error(error);
        }
        setLoading(false);
      }
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

        <form onSubmit={login}>
          <div className="row">
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
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
                  required
                  type="email"
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
                  required
                  name="phoneNumber"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  error={error}
                  helperText={error ? "Password does not match" : ""}
                  label="Passowrd"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  helperText={error ? "Password does not match" : ""}
                  required
                  error={error}
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  onBlur={(e) => setError(userData.password !== e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={error}
                loading={loading}
                loadingPosition="end"
                endIcon={<Person />}
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
