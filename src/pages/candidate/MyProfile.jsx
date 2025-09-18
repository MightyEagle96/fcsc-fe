import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { headerMap } from "./headerMap";
import { Table } from "react-bootstrap";
import { ArrowRight } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("myfullprofile");

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography color="GrayText" variant="h5" fontWeight={700}>
              My Profile {"  "}
              {loading && <CircularProgress size={20} color="GrayText" />}
            </Typography>
          </div>
          <div className="col-lg-8">
            <Table striped borderless>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {headerMap.map((c, i) => (
                  <tr key={i}>
                    <td>{c.label}</td>
                    <td className="text-capitalize">
                      <strong>{c.format(profile?.[c.field])}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                color="error"
                variant="contained"
                onClick={() => navigate("/documentstoupload")}
                endIcon={<ArrowRight />}
              >
                upload documents
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
