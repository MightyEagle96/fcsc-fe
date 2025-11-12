import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function AccreditationSummary() {
  const [candidates, setCandidates] = useState([]);
  const getData = async () => {
    const { data } = await httpService("evs/admindashboard");
    if (data) {
      console.log(data);
      setCandidates(data);
    }
  };
  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { field: "id", headerName: "S/N", width: 90 },
    { field: "centreId", headerName: "Centre ID", width: 100 },

    { field: "accreditationCount", headerName: "Accredited", width: 200 },
    { field: "expectedCandidatesCount", headerName: "Expected", width: 200 },
    { field: "centreName", headerName: "Centre Name", width: 600 },
  ];
  return (
    <div>
      <div className="container mt-5">
        <div className="mb-4">
          <Typography variant="h5" fontWeight={700}>
            Accreditation Summary
          </Typography>
        </div>
        <div className="mb-4">
          <DataGrid columns={columns} rows={candidates} />
        </div>
      </div>
    </div>
  );
}

export default AccreditationSummary;
