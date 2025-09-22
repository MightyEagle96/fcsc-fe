import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { Search } from "@mui/icons-material";

function UpdateCandidate() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/searchcandidate", {
      params: { q: search },
    });

    if (data) {
      setCandidates(data);
      console.log(data);
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h5" fontWeight={700}>
              Update Candidate
            </Typography>
          </div>

          <div className="col-lg-4 mb-4">
            <TextField
              fullWidth
              label="Search Candidate"
              helperText="IPPIS Number, Name, Email, Phone Number"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={getData}
              variant="contained"
              color="error"
              className="mt-3"
              endIcon={<Search />}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCandidate;
