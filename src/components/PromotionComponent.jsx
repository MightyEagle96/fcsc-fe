import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { httpService } from "../httpService";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function PromotionComponent() {
  const { user } = useAppUser();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const getData = async () => {
    setLoading(true);
    const { data, error } = await httpService("admin/promotiondashboard");
    if (data) {
      setSummary(data);
    }

    if (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mt-3 mb-3 container">
        <div className="d-flex justify-content-end">
          <div className="col-lg-4">
            {user.yetToChangePassword && (
              <Alert severity="warning">
                Please change your password to secure your account
                <div className="text-end">
                  <Button color="warning">
                    <Typography variant="caption">Change Password</Typography>
                  </Button>
                </div>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div
        className=" mb-5  d-flex align-items-center"
        style={{
          backgroundColor: "#243642",
          minHeight: "25vh",
          color: "#F7F7F7",
        }}
      >
        <div className="container w-100 pt-3 pb-3">
          <div className="mb-3">
            <Typography variant="h4" fontWeight={700}>
              Welcome Back, {user.firstName} {user.lastName}
            </Typography>
            <Typography>
              You are logged in as{" "}
              <b className="text-uppercase">{user.specificRole} officer</b>
            </Typography>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && (
          <div className="text-center">
            <CircularProgress size={20} />
          </div>
        )}
        <div className="row d-flex justify-content-center">
          {summary && (
            <>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Recommended</Typography>
                <Typography variant="h3">
                  <b>{summary?.recommended}</b>
                </Typography>
                <Button
                  endIcon={<Visibility />}
                  onClick={() => navigate("/admin/promorecommended/")}
                >
                  view
                </Button>
              </div>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Not Recommended</Typography>
                <Typography variant="h3">
                  <b>{summary?.notRecommended}</b>
                </Typography>
                <Button
                  endIcon={<Visibility />}
                  onClick={() => navigate("/admin/promorecommended/")}
                >
                  view
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromotionComponent;
