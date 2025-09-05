import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { headerMap } from "./headerMap";
import { Table } from "react-bootstrap";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const getData = async () => {
    const { data } = await httpService("myfullprofile");

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography color="GrayText" variant="h5" fontWeight={700}>
              My Profile
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
