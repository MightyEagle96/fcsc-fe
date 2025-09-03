import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpService } from "../httpService";
import { useAppUser } from "../contexts/AppUserContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { People, Upload } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

function AdminComponent() {
  const { user } = useAppUser();

  const [summary, setSummary] = useState({});
  const [mdaSummary, setMdaSummary] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const [data1, data2] = await Promise.all([
      httpService("admin/dashboardsummary"),
      httpService("admin/mdaoverview"),
    ]);

    if (data1) {
      const { data } = data1;
      if (data) setSummary(data);
    }

    if (data2) {
      const { data } = data2;

      if (data) setMdaSummary(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  const uploadFile = async (e) => {
    const formData = new FormData();
    setLoading(true);

    formData.append("file", file, file.name);

    const { data, error } = await httpService.post(
      "/admin/uploadfile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // documentid: document._id,
        },
      }
    );

    if (data) {
      toast.success(data);
      getData();
    }

    if (error) {
      toast.error(error);
    }

    setLoading(false);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
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
      field: "name",
      headerName: "MDA",
      width: 500,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "value",
      headerName: "Candidates",
      width: 300,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
  ];

  const handleRowClick = async (e) => {
    navigate(`/admin/mdacandidates/${e.row.name}`);
  };
  return (
    <div>
      {" "}
      <div>
        <div
          className="d-flex align-items-center mb-5"
          style={{
            backgroundColor: "#26667F",
            color: "#fff",
            minHeight: "25vh",
          }}
        >
          <div className="container w-100 ">
            <div className="row">
              <div className="col-lg-3">
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Welcome Back,
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="body1" gutterBottom>
                  Total Candidates
                </Typography>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  {summary.candidates}
                </Typography>
                <Button
                  sx={{
                    backgroundColor: "#B9375D",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#9e2d4c", // a bit darker for hover
                    },
                  }}
                  onClick={() => navigate("/admin/candidates")}
                >
                  View Details
                </Button>
              </div>
              <div className="col-lg-3">
                <Typography variant="body1" gutterBottom>
                  Verified Candidates
                </Typography>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  {summary.verifiedCandidates}
                </Typography>
                <Button
                  sx={{
                    backgroundColor: "#FFCB61",
                    color: "#000", // darker text for contrast
                    "&:hover": {
                      backgroundColor: "#e6b354", // slightly darker
                    },
                  }}
                  onClick={() => navigate("/admin/verifiedcandidates")}
                >
                  View Details
                </Button>
              </div>
              <div className="col-lg-3">
                <Typography variant="body1" gutterBottom>
                  Unverified Candidates
                </Typography>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  {summary.unverifiedCandidates}
                </Typography>
                <Button
                  endIcon={<People />}
                  sx={{
                    backgroundColor: "#67C090",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#57a87d",
                    },
                  }}
                  onClick={() => navigate("/admin/unverifiedcandidates")}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="col-lg-4 mb-4">
            <Typography gutterBottom>Upload candidate's file</Typography>
            <input
              className="form-control mb-3"
              type="file"
              id="formFile"
              onChange={handleFile}
              accept={".xlsx,.xls,.csv"}
            />
            <Button
              onClick={uploadFile}
              disabled={!file}
              variant="contained"
              endIcon={<Upload />}
              loading={loading}
              loadingPosition="end"
            >
              <Typography variant="caption">Upload File</Typography>
            </Button>
          </div>
          <div>
            <div className="mb-4">
              <Typography variant="h4" fontWeight={700}>
                MDAs OVERVIEW
              </Typography>
            </div>
            <div className="col-lg-8" style={{ height: 800 }}>
              <DataGrid
                rows={mdaSummary}
                columns={columns}
                onRowClick={handleRowClick}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComponent;
