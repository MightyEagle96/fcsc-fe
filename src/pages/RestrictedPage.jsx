import { Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { useNavigate } from "react-router-dom";

function RestrictedPage() {
  return (
    <div>
      <div
        style={{ height: "80vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Stack direction={"row"}>
          <div>
            <Typography variant="h3" fontWeight={700}>
              403
            </Typography>
          </div>
          <div className="border-start d-flex align-items-center p-2 ms-2">
            <Typography color={"GrayText"}>
              You don't have enough admin privileges to view this page
            </Typography>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default RestrictedPage;
