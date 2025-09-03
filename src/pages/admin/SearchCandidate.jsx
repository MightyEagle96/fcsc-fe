import { Button, TextField, Typography, Avatar, Stack } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { Badge, Modal } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { switchColors } from "../HR/HRCandidatesList";
import { QuestionMark } from "@mui/icons-material";
import { toast } from "react-toastify";

function SearchCandidate() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedRow, setSelecteRow] = useState(null);

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

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Badge
          style={{ textTransform: "uppercase" }}
          bg={switchColors(params.value)}
        >
          {params.value}
        </Badge>
      ),
    },
    { field: "ippisNumber", headerName: "IPPIS Number", width: 150 },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "DOB",
      width: 120,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return ""; // fallback if invalid
        return date.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "stateOfOrigin",
      headerName: "State of Origin",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "lga",
      headerName: "LGA",
      width: 120,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "poolOffice",
      headerName: "Pool Office",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "currentMDA",
      headerName: "Current MDA",
      width: 180,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "cadre",
      headerName: "Cadre",
      width: 120,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    { field: "gradeLevel", headerName: "Grade Level", width: 140 },
    {
      field: "dateOfFirstAppointment",
      headerName: "First Appointment",
      width: 160,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return ""; // fallback if invalid
        return date.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "dateOfConfirmation",
      headerName: "Confirmation",
      width: 160,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return ""; // fallback if invalid
        return date.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "dateOfLastPromotion",
      headerName: "Last Promotion",
      width: 160,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return ""; // fallback if invalid
        return date.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    { field: "phoneNumber", headerName: "Phone", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "stateOfCurrentPosting",
      headerName: "Posting State",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    { field: "year2021", headerName: "2021", width: 100 },
    { field: "year2022", headerName: "2022", width: 100 },
    { field: "year2023", headerName: "2023", width: 100 },
    { field: "year2024", headerName: "2024", width: 100 },
    { field: "remark", headerName: "Remark", width: 200 },
    { field: "password", headerName: "Password", width: 200 },
    { field: "dateRecommended", headerName: "Date Recommended", width: 200 },
    { field: "recommendedBy", headerName: "Recommended By", width: 200 },
    { field: "dateApproved", headerName: "Date Approved", width: 200 },
    { field: "approvedBy", headerName: "Approved By", width: 200 },
  ];

  const handleRowClick = async (e) => {
    setSelecteRow(e.row);
  };

  const reverseData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/reverseapproval", {
      params: { _id: selectedRow._id },
    });

    if (data) {
      toast.success(data);
      setSelecteRow(null);
      getData();
    }
    setLoading(false);
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
      <div className="p-3">
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={candidates}
            columns={columns}
            onRowClick={handleRowClick}
            // rowCount={rowCount}
            // paginationMode="server"
            // paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
            // pageSizeOptions={[50, 100]}
          />
        </div>
      </div>
      {selectedRow && (
        <Modal
          size="lg"
          centered
          show={selectedRow}
          onHide={() => setSelecteRow(null)}
        >
          <Modal.Header closeButton className="border-0">
            {/* <Modal.Title>Modal heading</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="d-flex justify-content-center mb-4">
                <Avatar
                  sx={{ width: 100, height: 100, backgroundColor: "#26667F" }}
                >
                  <QuestionMark sx={{ width: 50, height: 50 }} />
                </Avatar>
              </div>
              <div className="mb-3 text-center">
                <Typography
                  textTransform={"capitalize"}
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#26667F" }}
                >
                  {selectedRow.fullName}
                </Typography>
              </div>
              <div className="text-center">
                <Typography color="text.secondary">
                  Are you sure you want to reverse the recommendation or the
                  approval for this candidate?
                </Typography>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Stack direction={"row"} spacing={2}>
              <Button
                variant="contained"
                loading={loading}
                onClick={reverseData}
                disabled={selectedRow.approved}
              >
                Go Ahead
              </Button>
              <Button color="error" onClick={() => setSelecteRow(null)}>
                Cancel
              </Button>
            </Stack>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default SearchCandidate;
