import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { httpService } from "../httpService";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

function PromotionComponent() {
  const { user } = useAppUser();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mdaSummary, setMdaSummary] = useState([]);
  const [poolOfficeSummary, setPoolOfficeSummary] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    const [data1, data2, data3] = await Promise.all([
      httpService("admin/promotiondashboard"),
      httpService("promotion/candidatesacrossmda"),
      httpService("promotion/candidatesacrosspooloffice"),
    ]);

    if (data1) {
      const { data } = data1;
      if (data) {
        setSummary(data);
      }
    }

    if (data2) {
      const { data } = data2;
      if (data) {
        setMdaSummary(data);
      }
    }
    if (data3) {
      const { data } = data3;
      if (data) {
        setPoolOfficeSummary(data);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "currentMDA",
      headerName: "CURRENT MDA",
      flex: 1,
      //width: 500,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "candidateCount",
      headerName: "Recommended Candidates",
      width: 300,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
  ];
  const column2 = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "poolOffice",
      headerName: "POOL OFFICE",
      flex: 1,
      //width: 500,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "candidateCount",
      headerName: "Recommended Candidates",
      width: 300,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
  ];
  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="col-lg-4">
            {user.yetToChangePassword && (
              <Alert severity="warning">
                <AlertTitle>Yet to change password</AlertTitle>
                Please logout and make use of the forgot password functionality
                to create a new password
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div
        className=" mb-5  d-flex align-items-center"
        style={{
          backgroundColor: "#243642",
          minHeight: "25vh",
          color: "#F7F7F7",
        }}
      >
        <div className="container w-100 pt-3 pb-3">
          <div className="mb-3">
            <Typography variant="h4" fontWeight={700}>
              Welcome Back,{" "}
              <span className="text-capitalize">
                {user.firstName} {user.lastName}
              </span>
            </Typography>
            <Typography>
              You are logged in as{" "}
              <b className="text-uppercase">{user.specificRole} officer</b>
            </Typography>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && (
          <div className="text-center">
            <CircularProgress size={20} />
          </div>
        )}
        <div className="row d-flex justify-content-center mb-4">
          {summary && (
            <>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Recommended</Typography>
                <Typography variant="h3">
                  <b>{summary?.recommended}</b>
                </Typography>
                <Button
                  endIcon={<Visibility />}
                  onClick={() => navigate("/admin/promorecommended/")}
                >
                  view
                </Button>
              </div>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Approved</Typography>
                <Typography variant="h3">
                  <b>{summary?.approved}</b>
                </Typography>
                <Button
                  endIcon={<Visibility />}
                  onClick={() => navigate("/admin/approvedcandidates/")}
                >
                  view
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="row">
          <div className="col-lg-6">
            <DataGrid columns={columns} rows={mdaSummary} />
          </div>
          <div className="col-lg-6">
            <DataGrid columns={column2} rows={poolOfficeSummary} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionComponent;
