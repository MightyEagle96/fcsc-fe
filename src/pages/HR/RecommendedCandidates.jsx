import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function RecommendedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">{param.value}</span> // full uppercase
      ),
    },
    {
      field: "uploadedDocuments",
      headerName: "Uploaded Documents",
      width: 200,
    },
    {
      field: "recommendedBy",
      headerName: "Recommended By",
      width: 200,
    },
    {
      field: "dateRecommended",
      headerName: "Date Recommended",
      width: 200,
      renderCell: (params) => {
        return (
          <span className="text-capitalize">
            {new Date(params.value).toLocaleDateString()},{" "}
            {new Date(params.value).toLocaleTimeString()}
          </span>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("hr/viewrecommendedcandidates");

    if (data) {
      setCandidates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const { slug } = useParams();
  return (
    <div className="mt-5 mb-5 container">
      <div className="mb-5 ">
        <Typography>Recommended Candidates</Typography>
        <Typography variant="h5" textTransform={"uppercase"} fontWeight={700}>
          {slug}
        </Typography>
      </div>
      <div className="container">
        <DataGrid columns={columns} rows={candidates} loading={loading} />
      </div>
    </div>
  );
}

export default RecommendedCandidates;
