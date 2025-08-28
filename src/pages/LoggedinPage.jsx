import { useAppUser } from "../contexts/AppUserContext";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { Clear, Delete, UploadFile } from "@mui/icons-material";
const documents = [
  "Appointment Letter",
  "Birth Certificate/Court Affidavit",
  "First School Leaving Certificate",
  "Last promotion letter",
  "Professional Certificate",
  "Conversion",
  "Passport Photograph",
  "Signature",
];

function LoggedinPage() {
  const { user } = useAppUser();
  return (
    <div>
      <div
        className="mt-5 d-flex align-items-center mb-5"
        style={{ backgroundColor: "#3F7D58", minHeight: "35vh" }}
      >
        <div className="container w-100 text-white">
          <div className="row d-flex align-items-center">
            <div className="col-lg-8">
              <Typography fontWeight={700} variant="h4">
                Welcome, {user.name}
              </Typography>
              <div className="col-lg-6">
                <hr />
                <Typography gutterBottom variant="body2" fontWeight={300}>
                  File Number:{" "}
                  <span className="fw-bold, text-uppercase">
                    {user.fileNumber}
                  </span>
                </Typography>
                <Typography gutterBottom variant="body2" fontWeight={300}>
                  Email: <span className="fw-bold, ">{user.email}</span>
                </Typography>
                <Typography gutterBottom variant="body2" fontWeight={300}>
                  Phone Number:{" "}
                  <span className="fw-bold, text-uppercase">
                    {user.phoneNumber}
                  </span>
                </Typography>
              </div>
            </div>
            <div className="col-lg-4">
              <Avatar sx={{ height: 150, width: 150 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="container bg-light p-3 rounded mb-5">
        <div className="row d-flex justify-content-center pt-3 pb-3">
          <div
            className="col-lg-5 mb-4 p-4 rounded"
            style={{ backgroundColor: "#EF9651" }}
          >
            <Typography variant="body2" color="#ffffffff">
              Dear Candidate, please note that for you to be eligible to sit for
              the promotion examination, you must upload all required documents
              as indicated below.
            </Typography>
          </div>
        </div>
        <div className="row d-flex d-flex align-items-top mb-5">
          <div className="col-lg-9 border-end">
            <div className="row d-flex justify-cotent-center">
              {documents.map((c, i) => (
                <div className="col-lg-5 m-1 bg-white p-3 rounded">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <Typography color="#3F7D58" fontWeight={500}>
                        {c}
                      </Typography>
                    </div>
                    <div>
                      <Clear sx={{ color: "#D92C54" }} />
                    </div>
                  </div>
                  <div>
                    <Stack direction={"row"} spacing={2}>
                      <div>
                        <IconButton>
                          <UploadFile />
                        </IconButton>
                      </div>
                      <div className="border-end"></div>
                      <div>
                        <IconButton>
                          <Delete />
                        </IconButton>
                      </div>
                    </Stack>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-3 text-center">
            <div className="p-3 bg-white rounded-3">
              <div className="mb-1">
                <Typography fontWeight={300} color="GrayText">
                  Documents Uploaded
                </Typography>
              </div>
              <div>
                <Typography variant="h4" color="GrayText" fontWeight={700}>
                  0/{documents.length}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoggedinPage;
