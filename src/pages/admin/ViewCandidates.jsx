import { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge } from "react-bootstrap";

const columns = [
  {
    field: "id",
    headerName: "S/N",
    width: 90,
    sortable: false,
    filterable: false,
    //renderCell: (params) => params.api.getRowIndex(params.id) + 1,
  },
  {
    field: "recommended",
    headerName: "Status",
    width: 150,
    renderCell: (params) =>
      params.value ? (
        <Badge bg="success">Recommended</Badge>
      ) : (
        <Badge bg="warning">Not Recommended</Badge>
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
  { field: "defaultPassword", headerName: "Password", width: 200 },
];

function ViewCandidates() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0); // total records in DB

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("viewcandidates", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      setStudent(data.candidates);
      setRowCount(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  const deleteAllCandidates = () => {
    Swal.fire({
      icon: "question",
      title: "Delete all candidates",
      text: "Are you sure you want to delete all candidates?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await httpService("admin/deleteallcandidates");
        if (data) {
          toast.success(data);
          getData();
        }

        if (error) {
          toast.error(error);
        }
      }
    });
  };
  return (
    <div>
      <div className="p-3 overflow-scroll">
        <div className="container">
          <div className="mb-4">
            <div className="row">
              <div className="col-lg-3">
                <Typography variant="h4" fontWeight={700} color="#44444E">
                  Candidates
                </Typography>
              </div>
              <div className="col-lg-3">
                <Button
                  onClick={deleteAllCandidates}
                  variant="contained"
                  color="error"
                  endIcon={<Delete />}
                  loading={loading}
                >
                  Delete all candidates
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={student}
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

export default ViewCandidates;
