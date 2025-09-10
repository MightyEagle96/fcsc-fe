import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
function PasswordReset() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const createNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await httpService.post("admin/createnewpassword", {
      password,
      token: id,
    });

    if (data) {
      toast.success(data);
      navigate("/admin/login");
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
          <div className="col-lg-5">
            <div className="mb-4 text-center">
              <Typography color="GrayText" variant="h5" fontWeight={700}>
                Create new password
              </Typography>
            </div>
            <form onSubmit={createNewPassword}>
              <div className="mb-4">
                <TextField
                  type="password"
                  fullWidth
                  label="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <TextField
                  type="password"
                  fullWidth
                  label="Confirm Password"
                  required
                  onBlur={(e) => setError(e.target.value !== password)}
                />
              </div>
              <div className="mb-4 text-center">
                <Button
                  type="submit"
                  disabled={error}
                  variant="contained"
                  color="success"
                >
                  create new password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
