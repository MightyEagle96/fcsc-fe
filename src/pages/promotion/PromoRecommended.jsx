import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Button, Stack, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAppUser } from "../../contexts/AppUserContext";
import Modal2 from "react-modal";

function PromoRecommended() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [rowCount, setRowCount] = useState(0);

  const [selectedRow, setSelectedRow] = useState(null);
  const [uploadedDocuments, setUplodadedDocuments] = useState([]);

  const [rejecting, setRejecting] = useState(false);
  const [rejection, setRejection] = useState(null);
  const [disqualification, setDisqualification] = useState(null);
  const [reason, setReason] = useState("");

  const handleDisqualification = () => {
    setDisqualification(selectedRow);
    setSelectedRow(null);

    Swal.fire({
      icon: "question",
      title: "Disqualify Candidate",
      text: "Are you sure you want to disqualify this candidate",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data } = await httpService("promotion/disqualifycandidate", {
          params: { candidate: disqualification._id },
        });
        if (data) {
          toast.success(data);
          getData();
        }
        setLoading(false);
      }
    });
  };
  const handleRejection = () => {
    setRejection(selectedRow);
    setSelectedRow(null);
  };
  //  const [loading, ] = useState(false)
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService(`admin/recommendedcandidates`, {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });
    if (data) {
      setCandidates(data.candidates);
      setRowCount(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  console.log(user);
  const columns = [
    { field: "id", headerName: "S/N", width: 90 },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span>
      ),
    },
    {
      field: "currentMDA",
      headerName: "Current MDA",
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span>
      ),
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 200,
      flex: 1,
    },

    {
      field: "recommendedBy",
      headerName: "Recommended By",
      width: 200,
      flex: 1,
    },

    {
      field: "dateRecommended",
      headerName: "Date Recommended",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <span className="text-capitalize">
            {new Date(params.value).toLocaleDateString()},{" "}
            {new Date(params.value).toLocaleTimeString()}
          </span>
        );
      },
    },

    {
      field: "_id",
      headerName: "Action",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return <Button onClick={() => handleRowClick2(params)}>View</Button>;
      },
    },
  ];

  const handleRowClick2 = async (e) => {
    // console.log(e.row);
    setLoading(true);

    const { data } = await httpService("admin/uploadeddocuments", {
      params: { _id: e.row._id },
    });

    if (data) {
      setSelectedRow(e.row);

      setUplodadedDocuments(data.uploadedDocuments);
    }
    setLoading(false);
  };

  const approveCandidate = () => {
    Swal.fire({
      icon: "question",
      title: "Approve Candidate",
      text: "Are you sure you want to approve this candidate",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data } = await httpService("admin/approvecandidate", {
          params: { candidate: selectedRow._id },
        });

        if (data) {
          getData();
          setSelectedRow(null);
          toast.success(data);
        }
        setLoading(false);
      }
    });
  };

  const columns2 = [
    { field: "id", headerName: "S/N", width: 90 },
    { field: "fileType", headerName: "Document", width: 400 },
    {
      field: "fileUrl",
      headerName: "Document Link",
      width: 400,
      renderCell: (params) =>
        params.value && (
          <a
            href={params.value}
            target="_blank"
            rel="noreferrer"
            className="nav nav-link"
          >
            view document
          </a>
        ),
    },
    {
      field: "updatedAt",
      headerName: "Uploaded At",
      width: 200,
      flex: 1,
      renderCell: (params) =>
        params.value && new Date(params.value).toLocaleString(),
    },
  ];

  const submitRejection = () => {
    Swal.fire({
      icon: "question",
      title: "Reject Application",
      text: "Are you sure you want to proceed with the rejection?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRejecting(true);
        const { data, error } = await httpService.post("hr/rejectapplication", {
          //...rejection,
          candidate: rejection._id,
          reason,
        });
        if (data) {
          toast.success(data);
          getData();
          setSelectedRow(null);
          setUplodadedDocuments([]);
          setRejection(null);
        }
        if (error) {
          toast.error(error);
        }
        setRejecting(false);
      }
    });
  };

  // const submitRejection = () => {
  //   Swal.fire({
  //     icon: "question",
  //     title: "Reject Application",
  //     text: "Are you sure you want to proceed with the rejection?",
  //     showDenyButton: true,
  //     confirmButtonText: "Yes",
  //     denyButtonText: "No",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       setRejecting(true);
  //       const { data, error } = await httpService.post("hr/rejectapplication", {
  //         //...rejection,
  //         candidate: rejection._id,
  //         reason,
  //       });
  //       if (data) {
  //         toast.success(data);
  //         getData();
  //         setSelectedRow(null);
  //         setUplodadedDocuments([]);
  //         setRejection(null);
  //       }
  //       if (error) {
  //         toast.error(error);
  //       }
  //       setRejecting(false);
  //     }
  //   });
  // };
  return (
    <div>
      <div className="container mt-5 mb-5">
        <Typography variant="h5" fontWeight={700}>
          Recommended Candidates
        </Typography>
      </div>
      <div className="p-3">
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={candidates}
            columns={columns}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
            //  onRowClick={handleRowClick}
          />
        </div>
      </div>

      {selectedRow && (
        <Modal
          size="xl"
          centered
          show={selectedRow}
          onHide={() => setSelectedRow(null)}
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="text-capitalize">
              {selectedRow.fullName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <DataGrid
                rows={uploadedDocuments}
                columns={columns2}
                rowCount={uploadedDocuments.length}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            {user.specificRole === "promotion" && (
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  loading={loading}
                  onClick={approveCandidate}
                  disabled={selectedRow.approved}
                >
                  Approve application
                </Button>
                <Button
                  // disabled={recommendedStatus.enableButton}
                  color="warning"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleRejection}
                >
                  Reject Application
                </Button>
                <Button
                  // disabled={recommendedStatus.enableButton}
                  color="error"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleDisqualification}
                >
                  Disqualify Application
                </Button>
                <Button color="error" onClick={() => setSelectedRow(null)}>
                  Cancel
                </Button>
              </Stack>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {rejection && (
        <Modal
          centered
          backdrop="static"
          show={rejection}
          onHide={() => setRejection(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reject Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typography>
              You are about to reject the application for{" "}
              <strong className="text-uppercase">{rejection.fullName}</strong>.
            </Typography>

            <div className="mt-4">
              <TextField
                label="Reason"
                fullWidth
                helperText={"Reason for rejection"}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="contained"
              onClick={() => {
                setRejection(null);
              }}
            >
              Cancel
            </Button>
            <Button
              loading={rejecting}
              className="ms-3"
              color="error"
              onClick={submitRejection}
            >
              Reject
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default PromoRecommended;
