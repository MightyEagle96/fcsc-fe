import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material"; // MUI button since you’re using MUI
import { httpService } from "../httpService";
import { toast } from "react-toastify";
import { Download } from "@mui/icons-material";

const ExportCandidatesButton = () => {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    try {
      setLoading(true);
      const { data, error } = await httpService("admin/exportdataexcel", {
        responseType: "blob",
      });

      // Create a blob link
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "candidates.xlsx"); // filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      if (error) {
        toast.error(error);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error exporting candidates:", error);
    }
  };

  return (
    <Button
      loading={loading}
      variant="contained"
      color="primary"
      onClick={handleExport}
      endIcon={<Download />}
      loadingPosition="end"
    >
      Download Excel
    </Button>
  );
};

export default ExportCandidatesButton;
