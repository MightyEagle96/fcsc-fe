import { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge } from "react-bootstrap";
import { switchColors } from "../HR/HRCandidatesList";

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
    field: "candidate",
    headerName: "Candidate",
    width: 150,
    renderCell: (params) => (
      <span className="text-capitalize">{params.value.firstName}</span> // full uppercase
    ),
  }, //  { field: "defaultPassword", headerName: "Password", width: 200 },
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
