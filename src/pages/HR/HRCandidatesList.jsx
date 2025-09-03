import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Badge, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Send } from "@mui/icons-material";
function HRCandidatesList() {
  const { slug } = useParams();
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0); // total records in DB

  const [selectedRow, setSelectedRow] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const [uploadedDocuments, setUplodadedDocuments] = useState([]);
  const [recommending, setRecommending] = useState(false);

  const [recommendedStatus, setRecommendedStatus] = useState(null);

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/viewmdacandidates", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        slug,
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
      field: "recommended",
      headerName: "Status",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <Badge bg="success">Recommended</Badge>
        ) : (
          <Badge bg="warning">Not Recommended</Badge>
        ),
    },
    { field: "ippisNumber", headerName: "IPPIS Number", width: 150 },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
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
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "stateOfOrigin",
      headerName: "State of Origin",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "lga",
      headerName: "LGA",
      width: 120,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "poolOffice",
      headerName: "Pool Office",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "currentMDA",
      headerName: "Current MDA",
      width: 180,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "cadre",
      headerName: "Cadre",
      width: 120,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
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
    {
      field: "stateOfCurrentPosting",
      headerName: "Posting State",
      width: 160,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    { field: "year2021", headerName: "2021", width: 100 },
    { field: "year2022", headerName: "2022", width: 100 },
    { field: "year2023", headerName: "2023", width: 100 },
    { field: "year2024", headerName: "2024", width: 100 },
    { field: "remark", headerName: "Remark", width: 200 },
    {
      field: "uploadedDocuments",
      headerName: "Uploaded Documents",
      width: 200,
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

  const handleRowClick = async (e) => {
    // console.log(e.row);
    setLoading(true);

    const { data } = await httpService("admin/uploadeddocuments", {
      params: { _id: e.row._id },
    });

    if (data) {
      setUplodadedDocuments(data.uploadedDocuments);
      setRecommendedStatus({
        recommended: data.recommended,
        dateRecommended: data.dateRecommended,
        enableButton: data.enableButton,
      });
      setSelectedRow(e.row);
    }
    setLoading(false);
  };

  const recommendCandidate = () => {
    Swal.fire({
      icon: "question",
      title: "Recommend Candidate",
      text: "Are you sure you want to recommend this candidate?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRecommending(true);
        const { data } = await httpService("admin/recommendcandidate", {
          params: { candidate: selectedRow._id },
        });

        if (data) {
          toast.success(data);
          getData();
          setSelectedRow(null);
          setUplodadedDocuments([]);
        } else {
          toast.error(data);
        }
        setRecommending(false);
      }
    });
  };
  return (
    <div>
      <div className="container mt-5 mb-5">
        <div className="col-lg-4">
          <Typography variant="overline">MDA</Typography>
          <Typography variant="h5" fontWeight={700} textTransform={"uppercase"}>
            {slug}
          </Typography>
        </div>
      </div>
      <div className="p-3">
        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={student}
            columns={columns}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
      {selectedRow && (
        <Modal
          size="xl"
          centered
          show={selectedRow}
          onHide={() => {
            setSelectedRow(null);
            setUplodadedDocuments([]);
            setRecommendedStatus(null);
          }}
        >
          <Modal.Header className="border-0 bg-light" closeButton>
            <Modal.Title>
              <Typography
                variant="h5"
                fontWeight={700}
                textTransform={"capitalize"}
              >
                {selectedRow.fullName}
              </Typography>
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
            {recommendedStatus && recommendedStatus.recommended ? (
              <>
                <Badge bg="success">RECOMMENDED</Badge>
              </>
            ) : (
              <>
                <Button
                  endIcon={<Send />}
                  loading={recommending}
                  onClick={recommendCandidate}
                  loadingPosition="end"
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  disabled={recommendedStatus.enableButton}
                >
                  Recommend Candidate
                </Button>
                <Button
                  disabled={recommendedStatus.enableButton}
                  color="error"
                  sx={{ textTransform: "capitalize" }}
                >
                  Reject Candidate
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default HRCandidatesList;
