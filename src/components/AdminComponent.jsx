import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpService } from "../httpService";
import { useAppUser } from "../contexts/AppUserContext";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import { AlternateEmail, People, Sms, Upload } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

function AdminComponent() {
  const { user } = useAppUser();

  const [summary, setSummary] = useState({});
  const [mdaSummary, setMdaSummary] = useState({});
  const [uploadAnalysis, setUploadAnalysis] = useState([]);
  const [documentsAnalysis, setDocumentsAnalysis] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationAnalysis, setNotificationAnalysis] = useState({
    sms: 0,
    emails: 0,
  });
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getData = async () => {
    setLoading(true);
    const [data1, data2, data3, data4, data5] = await Promise.all([
      httpService("admin/dashboardsummary"),
      httpService("admin/mdaoverview"),
      httpService("admin/uploadanalysis"),
      httpService("admin/notificationanalysis"),
      httpService("admin/documentsanalysis"),
    ]);

    if (data1) {
      const { data } = data1;
      if (data) setSummary(data);
    }

    if (data2) {
      const { data } = data2;

      if (data) setMdaSummary(data);
    }
    if (data3) {
      const { data } = data3;

      if (data) setUploadAnalysis(data);
    }

    if (data4) {
      const { data } = data4;
      if (data) {
        setNotificationAnalysis(data);
      }
    }
    if (data5) {
      const { data } = data5;
      if (data) {
        setDocumentsAnalysis(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const columns2 = [
    {
      field: "document",
      headerName: "Document",
      width: 500,
    },
    {
      field: "count",
      headerName: "Count",
      width: 200,
    },
  ];
  const navigate = useNavigate();
  const uploadFile = async (e) => {
    const formData = new FormData();
    setLoading(true);

    formData.append("file", file, file.name);

    const { data, error } = await httpService.post(
      "/admin/uploadfile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // documentid: document._id,
        },
      }
    );

    if (data) {
      toast.success(data);
      getData();
    }

    if (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }

      if (error.duplicates) {
        setErrors(error.duplicates);
        setShowModal(true);
        //console.log(error.duplicates);
      }
      // console.log(error);
      // toast.error(error || error.message);
    }

    setLoading(false);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
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
      field: "name",
      headerName: "MDA",
      width: 500,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "value",
      headerName: "Candidates",
      width: 300,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
  ];

  const handleRowClick = async (e) => {
    navigate(`/admin/mdacandidates/${e.row.name}`);
  };

  const notifyByEmailAndSms = () => {
    Swal.fire({
      icon: "question",
      title: "Notify Candidates",
      text: "This will notify all created candidates of their account credentials by SMS and Email. Contacted candidates, will be skipped if they have already been notified. Are you sure you want to continue?",
      // text: "Are you sure you want to notify all candidates by SMS and Email?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data } = await httpService("admin/notifybyemailandsms");
        if (data) {
          toast.success(data);
          getData();
        }
        setLoading(false);
      }
    });
  };
  return (
    <div>
      <div>
        <div
          className="d-flex align-items-center mb-5"
          style={{
            backgroundColor: "#26667F",
            color: "#fff",
            minHeight: "25vh",
          }}
        >
          <div className="container w-100">
            <div className="row">
              <div className="col-lg-3 border-end d-flex align-items-center">
                <div>
                  <Typography variant="body1" gutterBottom fontWeight={300}>
                    Welcome Back,
                  </Typography>
                  <Typography
                    fontWeight={700}
                    variant="h5"
                    gutterBottom
                    textTransform={"capitalize"}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                </div>
              </div>
              <div className="col-lg-9 p-3">
                <div className="">
                  <Typography variant="caption" gutterBottom>
                    Total Candidates
                  </Typography>
                  <Typography variant="h3" gutterBottom fontWeight={700}>
                    {summary.candidates}
                  </Typography>
                </div>
                <div className="row">
                  <div className="col-lg-2">
                    <Typography variant="caption" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={700}>
                      {summary.pending}
                    </Typography>
                  </div>
                  <div className="col-lg-2">
                    <Typography variant="caption" gutterBottom>
                      Recommended
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={700}>
                      {summary.recommended}
                    </Typography>
                  </div>
                  <div className="col-lg-2">
                    <Typography variant="caption" gutterBottom>
                      Approved
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={700}>
                      {summary.approved}
                    </Typography>
                  </div>
                  <div className="col-lg-2">
                    <Typography variant="caption" gutterBottom>
                      Rejected
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={700}>
                      {summary.rejected}
                    </Typography>
                  </div>
                  <div className="col-lg-2">
                    <Typography variant="caption" gutterBottom>
                      Disqualified
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={700}>
                      {summary.disqualified}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-4 border-end ">
                <Typography gutterBottom>Upload candidate's file</Typography>
                <input
                  className="form-control mb-3"
                  type="file"
                  id="formFile"
                  onChange={handleFile}
                  accept={".xlsx,.xls,.csv"}
                />
                <Button
                  onClick={uploadFile}
                  disabled={!file}
                  variant="contained"
                  endIcon={<Upload />}
                  loading={loading}
                  loadingPosition="end"
                >
                  <Typography variant="caption">Upload File</Typography>
                </Button>
              </div>
              <div className="col-lg-4 d-flex align-items-center border-end">
                <div>
                  <div className="mb-2">
                    <Button
                      variant="contained"
                      color="warning"
                      endIcon={<People />}
                      loadingPosition="end"
                      loading={loading}
                      onClick={notifyByEmailAndSms}
                    >
                      Notify candidates by email and sms
                    </Button>
                  </div>
                  <div>
                    <Typography
                      className="mt-2"
                      color="GrayText"
                      variant="caption"
                    >
                      This is to send out account credentials to candidates, by
                      both sms and email.
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-muted">
                <Typography gutterBottom color="#5682B1" fontWeight={700}>
                  Notifications Analysis
                </Typography>
                <Stack spacing={2} direction={"row"}>
                  <div className="col-lg-6">
                    <Typography gutterBottom>
                      <AlternateEmail /> Email
                    </Typography>
                    <Typography variant="h3">
                      {notificationAnalysis.emails.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="col-lg-6">
                    <Typography gutterBottom>
                      <Sms /> SMS
                    </Typography>
                    <Typography variant="h3">
                      {notificationAnalysis.sms.toLocaleString()}
                    </Typography>
                  </div>
                </Stack>
              </div>
            </div>
          </div>
          <hr />
          <div className="p-3">
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-4">
                  <Typography variant="h4" fontWeight={700}>
                    MDAs OVERVIEW
                  </Typography>
                </div>
                <div className="" style={{ height: 800 }}>
                  <DataGrid
                    rows={mdaSummary}
                    columns={columns}
                    onRowClick={handleRowClick}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="col-lg-6 ">
                <div className="mb-4">
                  <Typography variant="h6" fontWeight={700}>
                    Upload Analysis
                  </Typography>
                </div>
                <div className="mb-4">
                  <Typography variant="caption" gutterBottom>
                    Uploaded Documents
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {documentsAnalysis.totalDocumentsUploaded}/
                    {documentsAnalysis.expectedDocuments}
                  </Typography>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <DataGrid
                      loading={loading}
                      getRowId={(row) => row.document}
                      columns={columns2}
                      rows={documentsAnalysis.result}
                    />
                  </div>
                  <div className="col-lg-4">
                    <div>
                      {uploadAnalysis.map((c, i) => (
                        <div
                          key={i}
                          className={`mb-2 p-2 ${
                            i % 2 === 0 ? "bg-light" : "bg-white"
                          }`}
                        >
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="GrayText"
                          >
                            Documents: <b>{c.uploads}</b>
                          </Typography>
                          <Typography
                            variant="body1"
                            gutterBottom
                            color="GrayText"
                          >
                            Candidates: <b>{c.candidates}</b>
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="static"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setErrors([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Errors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "50vh", overflowY: "scroll" }}>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminComponent;
