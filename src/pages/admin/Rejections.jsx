import { Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { useAppUser } from "../../contexts/AppUserContext";

function Rejections() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const [rejections, setRejections] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [totalRejections, setTotalRejections] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [rejecting, setRejecting] = useState(false);
  const [rejection, setRejection] = useState(null);
  const [disqualification, setDisqualification] = useState(null);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/rejections", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      console.log(data);
      setRejections(data.rejections);
      setTotalRejections(data.total);

      // setStudent(data.candidates);
      // setRowCount(data.total);
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
      field: "candidate",
      headerName: "Candidate",
      width: 300,
      renderCell: (param) => (
        <span className="text-capitalize">{param.value.fullName}</span> // full uppercase
      ),
    },
    {
      field: "reason",
      headerName: "Reason",
      width: 400,
    },
    {
      field: "rejectedBy",
      headerName: "Rejected by",
      width: 300,
      renderCell: (param) => (
        <span className="text-capitalize">
          {param.value.firstName} {param.value.lastName}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date Rejected",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">
          {new Date(param.value).toLocaleDateString("en-NG")},{" "}
          {new Date(param.value).toLocaleTimeString()}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (param) => (
        <Button onClick={() => handleRowClick2(param)}>View</Button>
      ),
    },
  ];

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

  useEffect(() => {
    getData();
  }, [paginationModel]);

  const handleRowClick2 = async (param) => {
    setLoading(true);

    console.log(param.row.candidate._id);
    const { data } = await httpService("admin/uploadeddocuments", {
      params: { _id: param.row.candidate._id },
    });

    if (data) {
      setSelectedRow(param.row);

      setUploadedDocuments(data.uploadedDocuments);
    }
    setLoading(false);
  };

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
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container mb-5">
          <Typography variant="h4" fontWeight={700}>
            Rejections ({totalRejections.toLocaleString()})
          </Typography>
        </div>
        <div className="p-3">
          <DataGrid
            loading={loading}
            rows={rejections}
            rowCount={totalRejections}
            columns={columns}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
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
              {selectedRow.candidate?.fullName}
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
            {user.specificRole === "promotion" &&
              selectedRow.status === "recommended" && (
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
    </div>
  );
}

export default Rejections;
