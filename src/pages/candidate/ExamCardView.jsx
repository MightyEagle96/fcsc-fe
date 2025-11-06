import React, { useEffect, useState } from "react";
import { useAppUser } from "../../contexts/AppUserContext";
import { httpService } from "../../httpService";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import { Download } from "@mui/icons-material";

function ExamCardView() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const getData = async () => {
    setLoading(true);

    const { data, error } = await httpService.get("card/slip");

    if (data) {
      setUrl(data);
      console.log(data);
      setError(false);
    }

    if (error) {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const printSlip = async () => {
    await httpService("card/printslip");
  };
  return (
    <div>
      {loading && <CircularProgress size={20} />}
      {url && !loading && (
        <Button
          onClick={printSlip}
          target="_blank"
          href={url}
          variant="contained"
          color="success"
          endIcon={<Download />}
        >
          Download exam card
        </Button>
      )}

      {error && !loading && (
        <div className="col-lg-6">
          <Alert severity="error">
            <AlertTitle>No exam card available</AlertTitle>
            You do not have an exam card.
          </Alert>
        </div>
      )}
    </div>
  );
}

export default ExamCardView;
