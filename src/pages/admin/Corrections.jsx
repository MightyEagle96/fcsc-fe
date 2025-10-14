import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Badge, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAppUser } from "../../contexts/AppUserContext";
import RestrictedPage from "../RestrictedPage";
import { Person, Search } from "@mui/icons-material";
import { CADRES } from "./data";
import { headerMap } from "../candidate/headerMap";

function Corrections() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState(null);
  const { user } = useAppUser();
  const [search, setSearch] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [candidateInView, setCandidateInView] = useState("");
  const [revealCandidate, setRevealCandidate] = useState(null);
  const [correctedCadre, setCorrectedCadre] = useState("");
  const [candidate, setCandidate] = useState(null);
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
      width: 200,
      renderCell: (params) => (
        <Button onClick={() => viewCorrection(params.value)}>
          View correction
        </Button>
        // <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "candidate",
      headerName: "Uploaded Documents",
      width: 200,
      renderCell: (params) => (
        <Button
          color="warning"
          onClick={() => getUploadedDocuments(params.value)}
        >
          view
        </Button>
        // <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "correctCadre",
      headerName: "Correct Cadre",
      width: 200,
      renderCell: (params) => (
        <Button color="error" onClick={() => getCandidateCadre(params)}>
          view
        </Button>
        // <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "viewCandidate",
      headerName: "View Candidate",
      width: 200,

      renderCell: (params) => {
        return (
          <IconButton onClick={() => getCandidate(params.row.candidate._id)}>
            <Person />
          </IconButton>
        );
      },
    },
  ];

  const getCandidate = async (id) => {
    console.log(id);
    setLoading(true);
    const { data } = await httpService("admin/candidate", {
      params: { id: id },
    });

    if (data) {
      setCandidate(data);
    }

    setLoading(false);
  };
  const getCandidateCadre = async (value) => {
    // console.log(value.row);
    setLoading(true);
    const { data } = await httpService(`admin/candidatecadre`, {
      params: { candidate: value.row.candidate._id },
    });

    if (data) {
      setRevealCandidate(data);
    }
    setLoading(false);
  };

  const updateCadre = () => {
    Swal.fire({
      icon: "question",
      title: "Update Cadre",
      text: "Are you sure you want to update the cadre for this candidate",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await httpService.post("admin/updatecadre", {
          candidateId: revealCandidate._id,
          newCadre: correctedCadre,
        });

        if (data) {
          toast.success(data);
          setRevealCandidate(null);
          setCorrectedCadre("");
          getData();
        }

        if (error) {
          toast.error(error);
        }
        setLoading(false);
      }
    });
  };

  const getUploadedDocuments = async (value) => {
    setLoading(true);

    setCandidateInView(value.fullName);

    const { data } = await httpService("admin/uploadeddocuments", {
      params: { _id: value._id },
    });

    if (data) {
      setUploadedDocuments(data.uploadedDocuments);
    }
    setLoading(false);
  };

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

      {uploadedDocuments.length > 0 && (
        <Modal
          show={uploadedDocuments.length > 0}
          onHide={() => {
            setUploadedDocuments([]);
            setCandidateInView("");
          }}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Documents for{" "}
              <span className="text-uppercase fw-bold">{candidateInView}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DataGrid
              rows={uploadedDocuments}
              columns={columns2}
              rowCount={uploadedDocuments.length}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      )}

      {revealCandidate && (
        <Modal onHide={() => setRevealCandidate(null)} show={revealCandidate}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Typography
                variant="h6"
                fontWeight={700}
                color="GrayText"
                textTransform={"capitalize"}
              >
                {revealCandidate.fullName}
              </Typography>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <Typography>
                Current Cadre: <strong>{revealCandidate.cadre || "N/A"}</strong>
              </Typography>
            </div>
            <div className="mb-4">
              <TextField
                onChange={(e) => setCorrectedCadre(e.target.value)}
                fullWidth
                label="Select Cadre"
                select
              >
                {CADRES.map((cadre) => (
                  <MenuItem key={cadre} value={cadre}>
                    {cadre}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setRevealCandidate(null)}>Close</Button>
            <Button variant="contained" onClick={updateCadre} loading={loading}>
              Update Cadre
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {candidate && (
        <Modal
          onHide={() => setCandidate(null)}
          size="xl"
          show={candidate}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-capitalize">
              {candidate.fullName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ height: "70vh", overflowY: "scroll" }}>
              <Table striped borderless>
                {/* <thead>
                  <tr>
                    <th>Item</th>
                    <th>Value</th>
                  </tr>
                </thead> */}
                <tbody>
                  {headerMap.map((c, i) => (
                    <tr key={i}>
                      <td>{c.label}</td>
                      <td className="text-capitalize">
                        <strong>{c.format(candidate?.[c.field])}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* <DataGrid
                rows={uploadedDocuments}
                columns={columns2}
                rowCount={uploadedDocuments.length}
              /> */}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Corrections;
