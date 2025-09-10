import { Button, TextField, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const resetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { data, error } = await httpService.post("admin/resetpassword", {
      email,
    });

    if (data) {
      toast.success(data);
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="mt-5 mb-5 container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-5 border rounded shadow-sm p-4 pt-5 pb-5">
            <div className="mb-4 text-center">
              <Typography color="GrayText" variant="h5" fontWeight={700}>
                Reset Password
              </Typography>
            </div>
            <form onSubmit={resetPassword}>
              <div className="mb-4">
                <TextField
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  label="Email"
                  variant="outlined"
                  helperText="Please provide the email address associated with your account"
                />
              </div>
              <div className="text-center">
                <Button loading={loading} color="success" type="submit">
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
