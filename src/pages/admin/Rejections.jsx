import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Badge } from "react-bootstrap";

function Rejections() {
  const [loading, setLoading] = useState(false);
  const [rejections, setRejections] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [totalRejections, setTotalRejections] = useState(0);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/rejections", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      console.log(data);
      setRejections(data.rejections);
      setTotalRejections(data.total);

      // setStudent(data.candidates);
      // setRowCount(data.total);
    }
    setLoading(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "candidate",
      headerName: "Candidate",
      width: 300,
      renderCell: (param) => (
        <span className="text-capitalize">{param.value.fullName}</span> // full uppercase
      ),
    },
    {
      field: "reason",
      headerName: "Reason",
      width: 400,
    },
    {
      field: "rejectedBy",
      headerName: "Rejected by",
      width: 300,
      renderCell: (param) => (
        <span className="text-capitalize">
          {param.value.firstName} {param.value.lastName}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date Rejected",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">
          {new Date(param.value).toLocaleDateString("en-NG")},{" "}
          {new Date(param.value).toLocaleTimeString()}
        </span>
      ),
    },
    {
      field: "notifiedByEmail",
      headerName: "Notified By Email",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">
          {param.value ? (
            <Badge bg="success">Yes</Badge>
          ) : (
            <Badge bg="danger">No</Badge>
          )}
        </span>
      ),
    },
    {
      field: "notifiedBySms",
      headerName: "Notified By Sms",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">
          {param.value ? (
            <Badge bg="success">Yes</Badge>
          ) : (
            <Badge bg="danger">No</Badge>
          )}
        </span>
      ),
    },

    // {
    //   field: "recommendedBy",
    //   headerName: "Recommended By",
    //   width: 200,
    // },
    // {
    //   field: "uploadedDocuments",
    //   headerName: "Uploaded Documents",
    //   width: 200,
    // },
  ];
  useEffect(() => {
    getData();
  }, [paginationModel]);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container mb-5">
          <Typography variant="h4" fontWeight={700}>
            Rejections
          </Typography>
        </div>
        <div className="p-3">
          <DataGrid
            loading={loading}
            rows={rejections}
            rowCount={totalRejections}
            columns={columns}
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

export default Rejections;
