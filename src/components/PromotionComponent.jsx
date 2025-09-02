import { Alert, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { httpService } from "../httpService";

function PromotionComponent() {
  const { user } = useAppUser();

  const getData = async () => {
    const { data, error } = await httpService("admin/promotiondashboard");
    if (data) {
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
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
    </div>
  );
}

export default PromotionComponent;
