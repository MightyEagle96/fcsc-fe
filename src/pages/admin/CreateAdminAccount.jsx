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

  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (value) => {
    if (!/^0\d{10}$/.test(value)) {
      return "Phone number must be 11 digits and start with 0";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (value !== userData.password) {
      return "Password does not match";
    }
    return "";
  };

  const validateEmail = (value) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Enter a valid email address";
    }
    return "";
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
                  value={userData.email}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value),
                    }))
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      phoneNumber: validatePhoneNumber(e.target.value),
                    }))
                  }
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  inputProps={{ maxLength: 11 }} // 👈 prevents typing beyond 11 digits
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      password: validatePassword(e.target.value),
                    }))
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(e.target.value),
                    }))
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={
                  errors.confirmPassword ||
                  errors.password ||
                  errors.phoneNumber ||
                  errors.email
                }
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
