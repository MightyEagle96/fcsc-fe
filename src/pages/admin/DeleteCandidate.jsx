import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

function DeleteCandidate() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCandidate = async () => {
    const { data, error } = await httpService("admin/viewcandidate", {
      params: { ippisnumber: value },
    });

    if (data) {
      Swal.fire({
        icon: "question",
        title: "Delete Candidate",
        text: "Are you sure you want to delete this candidate?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const { data } = await httpService("admin/deletecandidate", {
            params: { ippisnumber: value },
          });
          if (data) {
            toast.success(data);
            ///getData();
          }
          setLoading(false);
        }
      });
      console.log(data);
    }
    if (error) {
      toast.error(error);
    }
    //Swal.fire
  };
  return (
    <div>
      <div className="mt-5 mb-5 container">
        <div className="mb-5">
          <Typography variant="h5" fontWeight={700}>
            Delete Candidate
          </Typography>
        </div>
        <div className="col-lg-4">
          <TextField
            fullWidth
            label="IPPIS Number"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={!value}
            color="error"
            variant="contained"
            className="mt-2"
            onClick={fetchCandidate}
            loading={loading}
          >
            {" "}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCandidate;
