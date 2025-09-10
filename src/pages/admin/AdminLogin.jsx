import React, { useState } from "react";
import { appLogo } from "../../assets/appTheme";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";

function AdminLogin() {
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(false);

  const navigate = useNavigate();
  const loginCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await httpService.post("admin/login", candidate);
    if (data) {
      window.location.href = "/admin/dashboard";

      //navigate("/admin/dashboard");
    }
    if (error) {
      toast.error(error);
    }

    setLoading(false);
  };
  return (
    <div>
      <div className="">
        <div className="container mt-5 mb-5">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-5 ps-4 pe-4 text-center bg-light pt-5 pb-5 rounded shadow-sm ">
              <div className="mb-4">
                <img src={appLogo} alt="logo" height={120} />
              </div>
              <div className="mb-4">
                <Typography
                  variant="h5"
                  textTransform={"uppercase"}
                  fontWeight={700}
                  color="#3F7D58"
                >
                  Admin Management Portal
                </Typography>
              </div>
              <form onSubmit={loginCandidate}>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Email Address"
                    onChange={(e) =>
                      setCandidate({ ...candidate, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Password"
                    type={passwordType ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setPasswordType(!passwordType)}
                            >
                              {passwordType ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(e) =>
                      setCandidate({ ...candidate, password: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  loading={loading}
                  loadingPosition="end"
                  color="success"
                  variant="contained"
                  endIcon={<Login />}
                >
                  Login
                </Button>

                <div className="mt-4">
                  <Typography color="GrayText" variant="body2">
                    <Nav.Link as={Link} to="/admin/forgot-password">
                      Forgot Password?
                    </Nav.Link>
                    {/* <Nav >
                    
                    </Nav> */}
                  </Typography>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
