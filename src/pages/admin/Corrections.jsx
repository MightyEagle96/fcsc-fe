import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Badge, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAppUser } from "../../contexts/AppUserContext";
import RestrictedPage from "../RestrictedPage";
import { Search } from "@mui/icons-material";

function Corrections() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState(null);
  const { user } = useAppUser();
  const [search, setSearch] = useState("");

  //console.log(user);

  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const [dashboard, setDashboard] = useState(null);

  const getData2 = async () => {
    const { data } = await httpService("admin/correctionsdashboard");

    if (data) {
      setDashboard(data);
    }
  };
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/corrections", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search,
      },
    });
    if (data) {
      setCorrections(data.corrections);
      setRowCount(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
    getData2();
  }, [paginationModel]);

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
      field: "name",
      headerName: "Candidate",
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "mda",
      headerName: "MDA",
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "correctionName",
      headerName: "Field to Correct",
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) =>
        params.value === "pending" ? (
          <Badge bg="warning">PENDING</Badge>
        ) : (
          <Badge bg="success">APPROVED</Badge>
        ),
    },
    {
      field: "_id",
      headerName: "View",
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => viewCorrection(params.value)}>
          View correction
        </Button>
        // <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
  ];

  const viewCorrection = async (id) => {
    setLoading(true);
    const { data } = await httpService("admin/correction", {
      params: { id: id },
    });

    if (data) {
      console.log(data);
      setCorrection(data);
    }
    setLoading(false);
  };

  const approveCorrection = () => {
    Swal.fire({
      icon: "question",
      title: "Approve Correction",
      text: "Are you sure you want to approve this correction",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data } = await httpService("admin/approvecorrection", {
          params: { id: correction._id },
        });
        if (data) {
          toast.success(data);
          setCorrection(null);
          getData();
        }
        setLoading(false);
      }
    });
  };

  if (user.specificRole === "promotion" && !user.hasRightToCorrection) {
    return <RestrictedPage />;
  }

  return (
    <div>
      <div className="container mt-5 mb-5">
        <div className="mb-3">
          <Typography variant="h5" fontWeight={700}>
            CORRECTIONS
          </Typography>
        </div>
        {dashboard && (
          <div className="row  ">
            <div className="col-lg-3 text-muted">
              <Typography variant="overline" gutterBottom>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {dashboard.total}
              </Typography>
            </div>
            <div className="col-lg-3 text-muted">
              <Typography variant="overline" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {dashboard.pending}
              </Typography>
            </div>
            <div className="col-lg-3 text-muted">
              <Typography variant="overline" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {dashboard.approved}
              </Typography>
            </div>
          </div>
        )}

        <div className="col-lg-4">
          <TextField
            fullWidth
            label="Search candidate"
            helperText="You can search by name, email, phone or ippis number"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            color="error"
            endIcon={<Search />}
            loading={loading}
            loadingPosition="end"
            onClick={getData}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="p-3">
        <DataGrid
          loading={loading}
          columns={columns}
          rows={corrections}
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={rowCount}
          pageSizeOptions={[50, 100]}
          onPaginationModelChange={setPaginationModel}
          // pagination={true}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Page {paginationModel.page + 1} of{" "}
          {Math.ceil(rowCount / paginationModel.pageSize)}
        </Typography>
      </div>
      {correction && (
        <Modal show={correction} onHide={() => setCorrection(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Correction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="alert alert-danger">
              <Typography variant="caption">Old Data</Typography>
              <Typography variant="body1" textTransform={"uppercase"}>
                {correction.oldData}
              </Typography>
            </div>

            <div className="alert alert-success">
              <Typography variant="caption">New Data</Typography>
              <Typography variant="body1" textTransform={"uppercase"}>
                {correction.newData}
              </Typography>
            </div>
            <div className="alert alert-light">
              <Typography variant="caption">Reason</Typography>
              <Typography variant="body1">{correction.reason}</Typography>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={approveCorrection}
              disabled={correction.status === "approved"}
            >
              Approve
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Corrections;
