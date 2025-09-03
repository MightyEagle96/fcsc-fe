import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ApprovedCandidates() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [rowCount, setRowCount] = useState(0);

  const [selectedRow, setSelecteRow] = useState(null);
  //  const [loading, ] = useState(false)
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService(`admin/approvedcandidates`, {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });
    if (data) {
      setCandidates(data.candidates);
      setRowCount(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  const columns = [
    { field: "id", headerName: "S/N", width: 90 },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span>
      ),
    },
    {
      field: "currentMDA",
      headerName: "Current MDA",
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span>
      ),
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 200,
      flex: 1,
    },

    {
      field: "approvedBy",
      headerName: "Approved By",
      width: 200,
      flex: 1,
    },

    {
      field: "dateApproved",
      headerName: "Date Approved",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <span className="text-capitalize">
            {new Date(params.value).toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="container mt-5 mb-5">
        <Typography variant="h5" fontWeight={700}>
          Approved Candidates
        </Typography>
      </div>
      <div className="p-3">
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={candidates}
            columns={columns}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
          />
        </div>
      </div>
    </div>
  );
}

export default ApprovedCandidates;
