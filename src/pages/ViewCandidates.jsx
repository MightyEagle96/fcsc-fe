import { useEffect, useState } from "react";
import { httpService } from "../httpService";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "S/N",
    width: 90,
    sortable: false,
    filterable: false,
    //renderCell: (params) => params.api.getRowIndex(params.id) + 1,
  },
  { field: "ippisNumber", headerName: "IPPIS Number", width: 150 },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 200,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
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
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  {
    field: "stateOfOrigin",
    headerName: "State of Origin",
    width: 160,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  {
    field: "lga",
    headerName: "LGA",
    width: 120,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  {
    field: "poolOffice",
    headerName: "Pool Office",
    width: 160,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  {
    field: "currentMDA",
    headerName: "Current MDA",
    width: 180,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  {
    field: "cadre",
    headerName: "Cadre",
    width: 120,
    renderCell: (params) => (
      <span>{params.value?.toUpperCase()}</span> // full uppercase
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
      <span>{params.value?.toUpperCase()}</span> // full uppercase
    ),
  },
  { field: "year2021", headerName: "2021", width: 100 },
  { field: "year2022", headerName: "2022", width: 100 },
  { field: "year2023", headerName: "2023", width: 100 },
  { field: "year2024", headerName: "2024", width: 100 },
  { field: "remark", headerName: "Remark", width: 200 },
];

function ViewCandidates() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    //setLoading(true);
    const { data } = await httpService("viewcandidates");

    if (data) {
      console.log(data);
      setStudent(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="p-3 overflow-scroll">
        <div className="text-center">
          {loading && <CircularProgress size={20} />}
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            //getRowId={(row) => row.ippisNumber}
            rows={student}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20, 50, 100]}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewCandidates;
