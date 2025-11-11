import { Login, QrCode } from "@mui/icons-material";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

function EvsLoginPage() {
  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState(false);
  const loginAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await httpService.post("evs/loginaccount", account);
    if (data) {
      console.log(data);
      //localStorage.setItem("evsAccount", JSON.stringify(data));
    }
    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  return (
    <div className="container">
      <div className="mt-5 mb-5">
        <div className="d-flex justify-content-center">
          <div className="col-lg-4">
            <div className="d-flex justify-content-center mb-4">
              <Avatar
                sx={{ backgroundColor: "#8ABEB9", width: 120, height: 120 }}
              >
                <QrCode sx={{ height: 80, width: 80 }} />
              </Avatar>
            </div>
            <div className="text-center mb-5">
              <Typography color="GrayText" variant="h5" fontWeight={700}>
                ELECTRONIC VERIFICATION SYSTEM
              </Typography>
            </div>
            <form onSubmit={loginAccount}>
              <div className="mb-3">
                <TextField fullWidth label="Centre ID" />
              </div>
              <div className="mb-3">
                <TextField fullWidth label="Password" />
              </div>
              <div className="mb-3">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="success"
                  endIcon={<Login />}
                  loadingPosition="end"
                  loading={loading}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvsLoginPage;
