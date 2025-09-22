import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { Clear, Done, Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAppUser } from "../../contexts/AppUserContext";
import RestrictedPage from "../RestrictedPage";

function UpdateCandidate() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [changed, setChanged] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/searchcandidate", {
      params: { q: search },
    });

    if (data) {
      if (data.length === 0) {
        toast.error("No candidate found");
      }
      setCandidates(data);
      console.log(data);
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
      //renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "ippisNumber",
      headerName: "IPPIS Number",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      renderCell: (param) => (
        <span className="text-capitalize">{param.value}</span> // full uppercase
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "stateOfOrigin",
      headerName: "Update Contact",
      flex: 1,
      renderCell: (param) => (
        <Button onClick={() => setCandidate(param.row)}>Update</Button>
      ),
    },
    {
      field: "_id",
      headerName: "Notify Candidate",
      flex: 1,
      renderCell: (param) => (
        <Button color="success" onClick={() => notifyCandidate(param.value)}>
          Notify Candidate
        </Button>
      ),
    },
    {
      field: "emailSent",
      headerName: "Email Sent",
      flex: 1,
      renderCell: (param) =>
        param.value ? <Done color="success" /> : <Clear color="error" />,
    },
    {
      field: "smsSent",
      headerName: "Sms Sent",
      flex: 1,
      renderCell: (param) =>
        param.value ? <Done color="success" /> : <Clear color="error" />,
    },
  ];

  const notifyCandidate = (id) => {
    Swal.fire({
      icon: "question",
      title: "Notify Candidate",
      text: "Are you sure you want to notify this candidate?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data } = await httpService("admin/notifycandidate", {
          params: { candidate: id },
        });
        if (data) {
          toast.success(data);
          getData();
        }
        setLoading(false);
      }
    });
  };
  const handleChange = (e) => {
    setChanged(true);
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const makeChange = () => {
    Swal.fire({
      icon: "question",
      title: "Update Candidate",
      text: "Are you sure you want to update this candidate?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await httpService.patch(
          "admin/updatecandidatecontact",
          candidate
        );
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

  const { user } = useAppUser();
  if (user.specificRole === "promotion" && !user.hasRightToCorrection) {
    return <RestrictedPage />;
  }

  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h5" fontWeight={700}>
              Update Candidate's contact details
            </Typography>
          </div>

          <div className="col-lg-4 mb-4">
            <TextField
              fullWidth
              label="Search Candidate"
              helperText="IPPIS Number, Name, Email, Phone Number"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={getData}
              variant="contained"
              color="error"
              className="mt-3"
              endIcon={<Search />}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="p-3">
          <DataGrid
            loading={loading}
            columns={columns}
            rows={candidates}
            rowCount={candidates.length}
          />
        </div>
        {candidate && (
          <Modal
            size="lg"
            centered
            show={candidate !== null}
            onHide={() => {
              setCandidate(null);
              setChanged(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-capitalize fw-bold">
                {candidate.fullName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-3">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Email"
                    value={candidate.email}
                    name="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={candidate.phoneNumber}
                    name="phoneNumber"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={makeChange}
                loading={loading}
                variant="contained"
                color="error"
                disabled={!changed}
              >
                Update change
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default UpdateCandidate;
