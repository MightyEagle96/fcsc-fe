import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { QuestionMark } from "@mui/icons-material";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function PromoRecommended() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [rowCount, setRowCount] = useState(0);

  const [selectedRow, setSelecteRow] = useState(null);
  const [uploadedDocuments, setUplodadedDocuments] = useState([]);
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
            {new Date(params.value).toLocaleDateString()}
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
        return (
          <Button onClick={() => handleRowClick2(params)}>View</Button>
          // <span className="text-capitalize">
          //   <Button
          //     variant="contained"
          //     color="success"
          //     onClick={approveCandidate}
          //   >
          //     Approve
          //   </Button>
          // </span>
        );
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
      setSelecteRow(e.row);
      console.log(data);

      setUplodadedDocuments(data.uploadedDocuments);
      // setRecommendedStatus({
      //   recommended: data.recommended,
      //   dateRecommended: data.dateRecommended,
      //   enableButton: data.enableButton,
      //   status: data.status,
      // });
      // setSelectedRow(e.row);
    }
    setLoading(false);
  };
  const handleRowClick = async (e) => {
    setSelecteRow(e.row);
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
          setSelecteRow(null);
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
          onHide={() => setSelecteRow(null)}
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="text-capitalize">
              {selectedRow.fullName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div>
              <div className="d-flex justify-content-center mb-4">
                <Avatar
                  sx={{ width: 100, height: 100, backgroundColor: "#26667F" }}
                >
                  <QuestionMark sx={{ width: 50, height: 50 }} />
                </Avatar>
              </div>
              <div className="mb-3 text-center">
                <Typography
                  textTransform={"capitalize"}
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#26667F" }}
                >
                  {selectedRow.fullName}
                </Typography>
              </div>
              <div className="text-center">
                <Typography color="text.secondary">
                  Are you sure you want to approve the registration for this
                  participant?
                </Typography>
              </div>
            </div> */}
            <div>
              <DataGrid
                rows={uploadedDocuments}
                columns={columns2}
                rowCount={uploadedDocuments.length}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Stack direction={"row"} spacing={2}>
              <Button
                variant="contained"
                loading={loading}
                onClick={approveCandidate}
                disabled={selectedRow.approved}
              >
                Approve
              </Button>
              <Button color="error" onClick={() => setSelecteRow(null)}>
                Cancel
              </Button>
            </Stack>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default PromoRecommended;
