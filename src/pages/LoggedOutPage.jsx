import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { httpService } from "../httpService";
import { toast } from "react-toastify";
import { appLogo } from "../assets/appTheme";

function LoggedOutPage() {
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(false);
  const loginCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, status } = await httpService.post(
      "logincandidate",
      candidate
    );

    if (status === 200) {
      window.location.href = "/";
    } else {
      toast.error(data);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh" }} className="bg-light">
      <div className="pt-5">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-5 ps-4 pe-4 text-center bg-white pt-5 pb-5 rounded">
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
                  Candidate Management Portal
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
                  color="error"
                  variant="contained"
                  endIcon={<Login />}
                >
                  Login
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoggedOutPage;
