import { Button, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { headerMap } from "./headerMap";
import { httpService } from "../../httpService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
function DataCorrection() {
  const [profile, setProfile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [correction, setCorrection] = useState(null);
  const [reason, setReason] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mycorrections, setMyCorrections] = useState([]);
  const getData = async () => {
    const [data1, data2] = await Promise.all([
      httpService("myfullprofile"),
      httpService("mycorrections"),
    ]);

    if (data1) {
      const { data } = data1;
      if (data) {
        setProfile(data);
      }
    }
    if (data2) {
      const { data } = data2;
      if (data) {
        setMyCorrections(data);
      }
    }
    const { data } = await httpService("myfullprofile");

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formType = {
    date: (
      <DatePicker
        sx={{ width: "100%" }}
        disableFuture
        onChange={(date) =>
          setCorrection({
            correctionName: selected?.label,
            correctionField: selected?.field,
            data: dayjs(date).format("YYYY-MM-DD"),
          })
        }
      />
    ),
    text: (
      <TextField
        label={selected?.label}
        fullWidth
        onChange={(e) =>
          setCorrection({
            correctionName: selected?.label,
            correctionField: selected?.field,
            data: e.target.value,
          })
        }
      />
    ),
    dropdown: (
      <TextField
        label={selected?.label}
        select
        fullWidth
        onChange={(e) =>
          setCorrection({
            correctionName: selected?.label,
            correctionField: selected?.field,
            data: e.target.value,
          })
        }
      >
        {selected?.filter
          ? selected
              .data(profile[selected.filter])
              .map((d) => <MenuItem value={d}>{d}</MenuItem>)
          : selected?.data?.map((d) => <MenuItem value={d}>{d}</MenuItem>)}
      </TextField>
    ),
    number: <TextField fullWidth type="number" />,
  };

  const submitCorrection = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      setLoading(true);
      if (result.isConfirmed) {
        const { data, error } = await httpService.patch("submitcorrection", {
          ...correction,
          reason,
        });
        if (data) {
          setSelected(null);
          setCorrection(null);
          setReason("");
          setWordCount(0);
          toast.success(data);
        }
        if (error) {
          toast.error(error);
        }
      }
      setLoading(false);
    });
  };

  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length <= 50) {
      setReason(text);
      setWordCount(words.length);
    }
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h5" fontWeight={700}>
              Data Correction
            </Typography>
          </div>
          <div className="col-lg-4">
            <div className="mb-4">
              <TextField
                onChange={(e) => setSelected(e.target.value)}
                label="Select data to correct"
                fullWidth
                select
              >
                {headerMap.map((c) => (
                  <MenuItem value={c}>{c.label}</MenuItem>
                ))}
              </TextField>
            </div>
            <div className="mb-4 text-capitalize">
              {profile && selected && formType[selected.type]}
            </div>

            {correction && (
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Reason for change"
                  helperText="Can you provide a valid reason why you are making this change"
                  multiline
                  value={reason}
                  maxRows={4}
                  onChange={handleChange}
                />
                <Typography
                  variant="caption"
                  color={wordCount >= 100 ? "error" : "textSecondary"}
                >
                  {wordCount}/100 words
                </Typography>
              </div>
            )}
            <div>
              <Button
                disabled={!correction}
                onClick={submitCorrection}
                variant="contained"
                color="success"
                loading={loading}
              >
                Submit Correction
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataCorrection;
