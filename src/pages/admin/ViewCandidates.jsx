import { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

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
    field: "ippisNumber",
    headerName: "IPPIS Number",
    width: 150,
    renderCell: (params) => (
      <span className="text-capitalize">{params.value}</span> // full uppercase
    ),
  },

  {
    field: "fullName",
    headerName: "Name",
    width: 150,
    renderCell: (params) => (
      <span className="text-capitalize">{params.value}</span> // full uppercase
    ),
  },
  {
    field: "dateOfBirth",
    headerName: "Date of birth",
    width: 150,
    renderCell: (params) => (
      <span className="text-capitalize">
        {new Date(params.value).toDateString()}
      </span> // full uppercase
    ),
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 150,
  },
  {
    field: "stateOfOrigin",
    headerName: "State of Origin",
    width: 200,
  },
  {
    field: "lga",
    headerName: "LGA",
    width: 200,
  },
  {
    field: "poolOffice",
    headerName: "Pool Office",
    width: 200,
  },
  {
    field: "currentMDA",
    headerName: "Current MDA",
    width: 200,
  },
  {
    field: "cadre",
    headerName: "Cadre",
    width: 200,
  },
  {
    field: "gradeLevel",
    headerName: "Grade Level",
    width: 200,
  },
  {
    field: "dateOfFirstAppointment",
    headerName: "Date of First Appointment",
    width: 200,
    renderCell: (params) => (
      <span className="text-capitalize">
        {new Date(params.value).toDateString()}
      </span> // full uppercase
    ),
  },
  {
    field: "dateOfConfirmation",
    headerName: "Date of Confirmation",
    width: 200,
    renderCell: (params) => (
      <span className="text-capitalize">
        {new Date(params.value).toDateString()}
      </span> // full uppercase
    ),
  },
  {
    field: "dateOfLastPromotion",
    headerName: "Date of Last Promotion",
    width: 200,
    renderCell: (params) => (
      <span className="text-capitalize">
        {new Date(params.value).toDateString()}
      </span> // full uppercase
    ),
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "stateOfCurrentPosting",
    headerName: "State of Current Posting",
    width: 200,
  },
  {
    field: "year2021",
    headerName: "2021",
    width: 200,
  },
  {
    field: "year2022",
    headerName: "2022",
    width: 200,
  },
  {
    field: "year2023",
    headerName: "2023",
    width: 200,
  },
  {
    field: "year2024",
    headerName: "2024",
    width: 200,
  },
  {
    field: "remark",
    headerName: "Remark",
    width: 200,
  },
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
      console.log(data);
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
        setLoading(true);
        const { data, error } = await httpService("admin/deleteallcandidates");
        if (data) {
          toast.success(data);
          getData();
        }

        if (error) {
          toast.error(error);
        }
        setLoading(false);
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
            </div>
          </div>
        </div>

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
  );
}

export default ViewCandidates;
