import { Login, QrCode } from "@mui/icons-material";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import React from "react";

function EvsLoginPage() {
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
            <div className="mb-3">
              <TextField fullWidth label="Centre ID" />
            </div>
            <div className="mb-3">
              <TextField fullWidth label="Password" />
            </div>
            <div className="mb-3">
              <Button
                variant="contained"
                fullWidth
                color="success"
                endIcon={<Login />}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvsLoginPage;
