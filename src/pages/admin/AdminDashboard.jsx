import { useEffect, useState } from "react";
import { useAppUser } from "../../contexts/AppUserContext";
import { Button, Typography } from "@mui/material";
import { httpService } from "../../httpService";
import { People, Upload } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user } = useAppUser();
  const [summary, setSummary] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const { data } = await httpService("admin/dashboardsummary");

    if (data) {
      setSummary(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      toast.error(error);
    }

    setLoading(false);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className="mb-5 ">
      <div
        className="d-flex align-items-center mb-5"
        style={{ backgroundColor: "#26667F", color: "#fff", minHeight: "25vh" }}
      >
        <div className="container w-100 ">
          <div className="row">
            <div className="col-lg-3">
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Welcome Back,
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Total Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                {summary.candidates}
              </Typography>
              <Button
                sx={{
                  backgroundColor: "#B9375D",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#9e2d4c", // a bit darker for hover
                  },
                }}
                onClick={() => navigate("/admin/candidates")}
              >
                View Details
              </Button>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Verified Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                {summary.verifiedCandidates}
              </Typography>
              <Button
                sx={{
                  backgroundColor: "#FFCB61",
                  color: "#000", // darker text for contrast
                  "&:hover": {
                    backgroundColor: "#e6b354", // slightly darker
                  },
                }}
                onClick={() => navigate("/admin/verifiedcandidates")}
              >
                View Details
              </Button>
            </div>
            <div className="col-lg-3">
              <Typography variant="body1" gutterBottom>
                Unverified Candidates
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                {summary.unverifiedCandidates}
              </Typography>
              <Button
                endIcon={<People />}
                sx={{
                  backgroundColor: "#67C090",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#57a87d",
                  },
                }}
                onClick={() => navigate("/admin/unverifiedcandidates")}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="col-lg-4">
          <Typography gutterBottom>Upload candidate's file</Typography>
          <input
            class="form-control mb-3"
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
      </div>
    </div>
  );
}

export default AdminDashboard;
