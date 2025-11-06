import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Person } from "@mui/icons-material";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

function EvsManagement() {
  const [show, setShow] = useState(false);
  const [centreId, setCentreId] = useState("");

  const createAccount = () => {
    Swal.fire({
      icon: "question",
      title: "Create new EVS account",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await httpService.post("evs/createaccount", {
          centreId,
        });

        if (data) {
          setShow(false);
          toast.success(data);
        }

        if (error) {
          toast.error(error);
        }
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-5">
            <Typography variant="h5" fontWeight={700}>
              Electronic Verification System
            </Typography>
            <Typography variant="body1">
              Management console for accrediting candidates
            </Typography>
          </div>

          <div className="row">
            <div className="col-lg-4 bg-light rounded shadow-sm p-4">
              <div>
                <Typography>EVS Accounts</Typography>
                <Typography variant="h5">5</Typography>
              </div>
              <div className="text-end">
                <Button onClick={() => setShow(!show)}>Add new account</Button>
              </div>
            </div>
            <div className="col-lg-3"></div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </div>
      <Modal centered show={show} onHide={() => setShow(!show)}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Create new EVS Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-3">
              <TextField
                fullWidth
                label="Centre ID"
                onChange={(e) => setCentreId(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button onClick={createAccount} color="success" endIcon={<Person />}>
            Create account
          </Button>
          {/* <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EvsManagement;
