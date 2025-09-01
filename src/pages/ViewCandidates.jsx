import React, { useEffect, useState } from "react";
import { httpService } from "../httpService";
import { Table } from "react-bootstrap";
import { CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const subjectData = [
  "ippisNumber",
  "fullName",
  "dateOfBirth",
  "gender",
  "stateOfOrigin",
  "lga",
  "poolOffice",
  "currentMDA",
  "cadre",
  "gradeLevel",
  "dateOfFirstAppointment",
  "dateOfConfirmation",
  "dateOfLastPromotion",
  "phoneNumber",
  "email",
  "stateOfCurrentPosting",
  "year2021",
  "year2022",
  "year2023",
  "year2024",
];

const columns = [
  { field: "ippisNumber", headerName: "IPPIS Number", width: 150 },
  { field: "fullName", headerName: "Full Name", width: 200 },
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
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "stateOfOrigin", headerName: "State of Origin", width: 160 },
  { field: "lga", headerName: "LGA", width: 120 },
  { field: "poolOffice", headerName: "Pool Office", width: 160 },
  { field: "currentMDA", headerName: "Current MDA", width: 180 },
  { field: "cadre", headerName: "Cadre", width: 120 },
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
  { field: "stateOfCurrentPosting", headerName: "Posting State", width: 160 },
  { field: "year2021", headerName: "2021", width: 100 },
  { field: "year2022", headerName: "2022", width: 100 },
  { field: "year2023", headerName: "2023", width: 100 },
  { field: "year2024", headerName: "2024", width: 100 },
  { field: "remark", headerName: "Remark", width: 200 },
];

// const rows = [
//   {
//     id: 1,
//     ippisNumber: "12345",
//     fullName: "John Doe",
//     dateOfBirth: "1990-01-01",
//     gender: "Male",
//     stateOfOrigin: "Lagos",
//     lga: "Ikeja",
//     poolOffice: "HQ",
//     currentMDA: "Finance",
//     cadre: "Admin",
//     gradeLevel: "GL12",
//     dateOfFirstAppointment: "2010-01-01",
//     dateOfConfirmation: "2012-01-01",
//     dateOfLastPromotion: "2020-01-01",
//     phoneNumber: "08012345678",
//     email: "john@example.com",
//     stateOfCurrentPosting: "Abuja",
//     year2021: "Pass",
//     year2022: "Pass",
//     year2023: "Pass",
//     year2024: "Pending",
//     remark: "Good performance",
//   },
//   // more rows here
// ];
function ViewCandidates() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    //setLoading(true);
    const { data } = await httpService("viewcandidates");

    if (data) {
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
            getRowId={(row) => row.ippisNumber}
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
