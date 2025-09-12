import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { httpService } from "../httpService";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function HRDashboard() {
  const { user } = useAppUser();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/mdacandidates", {
      params: { slug: user.mda },
    });

    if (data) {
      setSummary(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="col-lg-4">
            {user.yetToChangePassword && (
              <Alert severity="warning">
                <AlertTitle>Yet to change password</AlertTitle>
                Please logout and make use of the forgot password functionality
                to create a new password
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div
        className=" mb-5 d-flex align-items-center"
        style={{ backgroundColor: "#F1EFEC", minHeight: "25vh" }}
      >
        <div className="container w-100 pt-3 pb-3">
          <div className="mb-3">
            <Typography variant="h4" fontWeight={700}>
              Welcome Back, {user.firstName} {user.lastName}
            </Typography>
            <Typography>
              You are logged in as{" "}
              <b className="text-uppercase">HUMAN RESOURCES officer</b>
            </Typography>
          </div>
          <div className="text-muted mt-5">
            <Typography variant="body1">
              <b>MDA:</b> <span className="text-uppercase">{user.mda}</span>
            </Typography>
          </div>
        </div>
      </div>
      <div className="">
        {loading && (
          <div className="text-center">
            <CircularProgress size={20} />
          </div>
        )}
        <div className="row d-flex justify-content-center">
          <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
            <Typography variant="caption">Candidates</Typography>
            <Typography variant="h3">
              <b>{summary?.candidates}</b>
            </Typography>

            <Button
              endIcon={<Visibility />}
              onClick={() => navigate(`/admin/hrcandidates/${user.mda}`)}
            >
              view
            </Button>
          </div>
          {summary && (
            <>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Recommended</Typography>
                <Typography variant="h3">
                  <b>{summary?.recommended}</b>
                </Typography>
                <Button endIcon={<Visibility />}>view</Button>
              </div>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Approved</Typography>
                <Typography variant="h3">
                  <b>{summary?.approved}</b>
                </Typography>
                <Button endIcon={<Visibility />}>view</Button>
              </div>
              <div className="col-lg-3 rounded text-center bg-light m-1 p-3">
                <Typography variant="caption">Uploaded Documents</Typography>
                <Typography variant="h3">
                  <b>
                    {summary?.totalUploadedDocuments?.toLocaleString("en-US")}/
                    {(8 * summary?.candidates).toLocaleString("en-US") || ""}
                  </b>
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
