import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
function CredentialReveal() {
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [userData, setUserData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const revealCredential = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await httpService.post(
      "retrievecredentials",
      userData
    );
    if (data) {
      setCandidate(data);
      console.log(data);
      //toast.success(data);
    }
    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="container mt-5 mb-5">
        <div className="mb-4">
          <div className="text-center">
            <Typography
              gutterBottom
              color="GrayText"
              variant="h5"
              fontWeight={700}
            >
              Credential Reveal
            </Typography>
            <Typography>
              Use this feature to retrieve your login credential if you haven't
              gotten an email or sms
            </Typography>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-lg-4">
            <form onSubmit={revealCredential}>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="IPPIS Number"
                  name="ippisNumber"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Phone number"
                  name="phoneNumber"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="error"
                  loading={loading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {candidate && (
        <Modal show={candidate} onHide={() => setCandidate(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Credentials</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              <b>Name:</b>{" "}
              <span className="text-uppercase">{candidate.name}</span>
            </p>
            <p>
              <b>Email:</b> {candidate.email}
            </p>
            <p>
              <b>Password:</b> {candidate.password}
            </p>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default CredentialReveal;
