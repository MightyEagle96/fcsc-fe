import { MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { headerMap } from "./headerMap";
import { httpService } from "../../httpService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function DataCorrection() {
  const [profile, setProfile] = useState(null);
  const [selected, setSelected] = useState(null);
  const getData = async () => {
    const { data } = await httpService("myfullprofile");

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formType = {
    date: <DatePicker sx={{ width: "100%" }} disableFuture />,
    text: <TextField label={selected?.label} fullWidth />,
    dropdown: (
      <TextField label={selected?.label} select fullWidth>
        {selected?.filter
          ? selected
              .data(profile[selected.filter])
              .map((d) => <MenuItem value={d}>{d}</MenuItem>)
          : selected?.data?.map((d) => <MenuItem value={d}>{d}</MenuItem>)}
      </TextField>
    ),
    number: <TextField fullWidth type="number" />,
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h5" fontWeight={700}>
              Data Correction
            </Typography>
          </div>
          <div className="col-lg-4">
            <div className="mb-4">
              <TextField
                onChange={(e) => setSelected(e.target.value)}
                label="Select data to correct"
                fullWidth
                select
              >
                {headerMap.map((c) => (
                  <MenuItem value={c}>{c.label}</MenuItem>
                ))}
              </TextField>
            </div>
            <div className="mb-4 text-capitalize">
              {profile && selected && formType[selected.type]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataCorrection;
