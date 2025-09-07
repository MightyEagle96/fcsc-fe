import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function Corrections() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState(null);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/corrections");
    if (data) {
      setCorrections(data);
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
      //renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "name",
      headerName: "Candidate",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "mda",
      headerName: "MDA",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "correctionName",
      headerName: "Field to Correct",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "_id",
      headerName: "View",
      width: 200,
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
  return (
    <div>
      <div className="container mt-5 mb-5">
        <Typography variant="h5" fontWeight={700}>
          Corrections
        </Typography>
      </div>
      <div className="p-3">
        <DataGrid loading={loading} columns={columns} rows={corrections} />
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
