import { useAppUser } from "../contexts/AppUserContext";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { Delete, Upload, UploadFile } from "@mui/icons-material";
import { httpService } from "../httpService";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function LoggedinPage() {
  const { user } = useAppUser();
  const [documents, setDocuments] = useState([]);
  //  const [show, setShow] = useState(false);
  const [document, setDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMyDocuments = async () => {
    const { data } = await httpService("mydocuments");

    if (data) {
      console.log(data);
      setDocuments(data);
    }
    //return data;
  };

  useEffect(() => {
    getMyDocuments();
  }, []);

  const selectDocument = (doc) => {
    setDocument(doc);
    // setShow(true);
  };

  const handleFile = (e) => {
    const maxSize = 1 * 1024 * 1024;
    if (e.target.files[0].size > maxSize) {
      toast.error("File size is too large");
      return;
    }
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    setLoading(true);
    console.log(file.name);
    formData.append("file", file, file.name);

    const { data, error } = await httpService.post("/uploadfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        documentid: document._id,
      },
    });
    if (data) {
      toast.success("File uploaded successfully");
      // window.location.assign("/authoring/result");
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
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
      <div className="container   mb-5">
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
                <div className="col-lg-5 m-1 bg-light p-3 rounded">
                  <div className="d-flex justify-content-end text-end">
                    <p
                      className="p-1 m-0"
                      style={{
                        backgroundColor: "#e91e63",
                        color: "#fff",
                        fontSize: 10,
                        borderRadius: 5,
                      }}
                    >
                      Not Uploaded
                    </p>
                  </div>
                  <div className="mb-3">
                    <div>
                      <Typography
                        fontSize={20}
                        color="#3F7D58"
                        fontWeight={500}
                      >
                        {i + 1}. {c.fileType}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <Stack direction={"row"} spacing={1}>
                      <div>
                        <Button
                          onClick={() => selectDocument(c)}
                          startIcon={<UploadFile />}
                        >
                          <Typography
                            variant="caption"
                            sx={{ textTransform: "capitalize" }}
                          >
                            upload
                          </Typography>
                        </Button>
                      </div>
                      <div className="border-end"></div>
                      <div>
                        <div>
                          <Button color="error" startIcon={<Delete />}>
                            <Typography
                              variant="caption"
                              sx={{ textTransform: "capitalize" }}
                            >
                              Delete
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
      {document && (
        <Modal
          centered
          backdrop="static"
          size="lg"
          show={document}
          onHide={() => setDocument(null)}
        >
          <Modal.Header closeButton className="border-0"></Modal.Header>
          <Modal.Body>
            <div class="mb-3">
              <div className="mb-4">
                <label for="formFile" className="form-label text-lowercase">
                  select {document.fileType} (pdf, jpg, jpeg, png only)
                </label>
              </div>
              <input
                class="form-control"
                type="file"
                id="formFile"
                onChange={handleFile}
                accept=".pdf,.jpg,.jpeg,.png "
              />
              <small>{file ? file.name : ""}</small>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Button
              onClick={uploadFile}
              disabled={!file}
              startIcon={<Upload />}
              variant="contained"
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
