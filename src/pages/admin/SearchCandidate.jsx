import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";

function SearchCandidate() {
  const [search, setSearch] = useState("");

  const getData = async () => {
    const { data } = await httpService("admin/searchcandidate", {
      params: { q: search },
    });

    if (data) {
      console.log(data);
    }
  };
  return (
    <div>
      <div className="container mt-5 mb-5">
        <div className="mb-4">
          <Typography variant="h5" fontWeight={700}>
            Search Candidate
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
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SearchCandidate;
