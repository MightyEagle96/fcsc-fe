import { useAppUser } from "../contexts/AppUserContext";
import { Alert, Avatar, Button, Stack, Typography } from "@mui/material";
import { Campaign, Delete, Upload, Visibility } from "@mui/icons-material";
import { httpService } from "../httpService";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function LoggedinPage() {
  const { user } = useAppUser();
  const [documents, setDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState(0);
  //  const [show, setShow] = useState(false);
  const [document, setDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorFile, setErrorFile] = useState(false);

  const [fileFormats, setFileFormats] = useState("");

  const navigate = useNavigate();
  const getMyDocuments = async () => {
    const { data } = await httpService("mydocuments");

    if (data) {
      setUploadedDocuments(data.uploadedDocuments);
      setDocuments(data.documents);
    }
    //return data;
  };

  useEffect(() => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    } else getMyDocuments();
  }, []);

  const selectDocument = (doc) => {
    // console.log(doc);

    if (
      doc.fileType === "Passport Photograph" ||
      doc.fileType === "Signature"
    ) {
      setFileFormats(".jpg, .jpeg, .png");
    } else {
      setFileFormats(".pdf, .jpg, .jpeg, .png ");
    }
    setDocument(doc);
    // setShow(true);
  };

  const handleFile = (e) => {
    setErrorFile(false);
    const maxSize = 1 * 1024 * 1024;
    if (e.target.files[0].size > maxSize) {
      setErrorFile(true);
      toast.error("File size is too large");
      return;
    }
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    setLoading(true);

    formData.append("file", file, file.name);

    const { data, error } = await httpService.post("/uploadfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        documentid: document._id,
      },
    });

    setTimeout(() => {
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          timer: 3000,
          showConfirmButton: false,
        });
      }

      if (data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data,
          timer: 3000,
          showConfirmButton: false,
        });
      }
      getMyDocuments();

      if (document.fileType === "Passport Photograph") {
        window.location.reload();
      }

      setDocument(null);
      setLoading(false);
    }, 4000);
  };

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
                <Typography gutterBottom variant="body2" fontWeight={500}>
                  IPPIS Number:{" "}
                  <span className="fw-bold, text-uppercase">
                    {user.ippisNumber}
                  </span>
                </Typography>
                <Typography gutterBottom variant="body2" fontWeight={500}>
                  Email: <span className="fw-bold, ">{user.email}</span>
                </Typography>
                <Typography gutterBottom variant="body2" fontWeight={500}>
                  Phone Number:{" "}
                  <span className="fw-bold, text-uppercase">
                    {user.phoneNumber}
                  </span>
                </Typography>
              </div>
            </div>
            <div className="col-lg-4">
              <Avatar sx={{ height: 150, width: 150 }} src={user.passport} />
            </div>
          </div>
        </div>
      </div>
      <div className="container   mb-5">
        <div className="row pt-3 pb-3 mb-5">
          <div
            className="col-lg-5  p-3 "
            style={{ backgroundColor: "#EF9651" }}
          >
            <Stack
              direction={"row"}
              spacing={2}
              className="d-flex align-items-center"
            >
              <div>
                <Avatar sx={{ backgroundColor: "#ffb851" }}>
                  <Campaign />
                </Avatar>
              </div>
              <div>
                <Typography variant="body2" color="#ffffffff">
                  Dear Candidate, please note that for you to be eligible to sit
                  for the promotion examination, you must upload all required
                  documents as indicated below.
                </Typography>
              </div>
            </Stack>
          </div>
          <div
            className="col-lg-3  p-3 "
            style={{ backgroundColor: "#F3F2EC", color: "#1E93AB" }}
          >
            <Typography variant="caption">Documents Uploaded</Typography>
            <Typography variant="h4" fontWeight={700}>
              {uploadedDocuments}/{documents.length}
            </Typography>
          </div>
        </div>
        <div
          className="col-lg-4 mb-4 p-3 m-0"
          style={{ backgroundColor: "#DDF4E7" }}
        >
          <Typography color="#26667F" variant="subtitle2" fontWeight={500}>
            If you accidentally uploaded a wrong document, you can always upload
            the right document as the previous document will be overwritten.{" "}
          </Typography>
        </div>
        <div className="row d-flex d-flex align-items-top mb-5">
          <div className="">
            <div className="row d-flex justify-cotent-center">
              {documents.map((c, i) => (
                <div key={i} className="col-lg-5 m-1 bg-light p-3 ">
                  <div className="d-flex justify-content-end text-end">
                    <Stack direction={"row"} spacing={1}>
                      <div>
                        {(c.fileType === "Professional Certificate" ||
                          c.fileType === "Conversion") && (
                          <p
                            className="ps-2 pe-2 m-0"
                            style={{
                              backgroundColor: "#ffa726",
                              color: "#fff",
                              fontSize: 10,
                              borderRadius: 5,
                            }}
                          >
                            Optional
                          </p>
                        )}
                      </div>
                      <div>
                        {c.fileUrl ? (
                          <p
                            className="ps-2 pe-2 m-0"
                            style={{
                              backgroundColor: "#4caf50",
                              color: "#fff",
                              fontSize: 10,
                              borderRadius: 5,
                            }}
                          >
                            Uploaded
                          </p>
                        ) : (
                          <p
                            className="ps-2 pe-2 m-0"
                            style={{
                              backgroundColor: "#e91e63",
                              color: "#fff",
                              fontSize: 10,
                              borderRadius: 5,
                            }}
                          >
                            Not Uploaded
                          </p>
                        )}
                      </div>
                    </Stack>
                  </div>
                  <div className="mb-3">
                    <div>
                      <Typography color="#1E93AB" fontWeight={700}>
                        {i + 1}. {c.fileType}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <Stack direction={"row"} spacing={1}>
                      <div>
                        <Button
                          onClick={() => selectDocument(c)}
                          startIcon={<Upload />}
                        >
                          <Typography
                            variant="caption"
                            sx={{ textTransform: "capitalize" }}
                          >
                            upload
                          </Typography>
                        </Button>
                      </div>
                      {/* <div className="border-end"></div>
                      <div>
                        <div>
                          <Button
                            disabled={!c.fileUrl}
                            color="error"
                            startIcon={<Delete />}
                          >
                            <Typography
                              variant="caption"
                              sx={{ textTransform: "capitalize" }}
                            >
                              Delete
                            </Typography>
                          </Button>
                        </div>
                      </div> */}
                      <div className="border-end"></div>
                      <div>
                        <div>
                          <Button
                            href={c.fileUrl}
                            target="_blank"
                            disabled={!c.fileUrl}
                            color="warning"
                            startIcon={<Visibility />}
                          >
                            <Typography
                              variant="caption"
                              sx={{ textTransform: "capitalize" }}
                            >
                              View
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </Stack>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {document && (
        <Modal
          centered
          backdrop="static"
          size="lg"
          show={document}
          onHide={() => {
            setDocument(null);
            setFile(null);
            setErrorFile(false);
          }}
        >
          <Modal.Header closeButton className="border-0"></Modal.Header>
          <Modal.Body>
            <div class="mb-3">
              <div className="mb-4">
                <Typography color="#1E93AB" variant="overline">
                  document to upload
                </Typography>
                <Typography color="#1E93AB" variant="h4" fontWeight={700}>
                  {document.fileType}
                </Typography>
                <Typography
                  fontStyle={"italic"}
                  color="GrayText"
                  variant="caption"
                >
                  {fileFormats} only
                </Typography>
              </div>

              <input
                class="form-control"
                type="file"
                id="formFile"
                onChange={handleFile}
                // accept=".pdf,.jpg,.jpeg,.png"
                accept={fileFormats}
              />
              <small>{file ? file.name : ""}</small>
              <div className="col-lg-6 mt-3">
                {errorFile && <Alert severity="error">File too large</Alert>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Button
              onClick={uploadFile}
              disabled={!file || errorFile}
              startIcon={<Upload />}
              variant="contained"
              loading={loading}
              loadingPosition="end"
            >
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default LoggedinPage;
