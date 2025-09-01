import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { mdas } from "./data";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

const roles = ["HR", "PROMOTION"];

function AdminOfficers() {
  const [passwordType, setPasswordType] = useState(false);
  const [officer, setOfficer] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setOfficer((prev) => ({
        ...prev,
        role: value,
        mda: value === "HR" ? prev.mda : "", // keep mda only if role === HR
      }));
    } else {
      setOfficer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create officer",
      text: "Are you sure you want to create this officer?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await httpService.post(
          "admin/createaccount",
          officer
        );
        if (data) {
          officerDashboard();
          toast.success(data);
        }
        if (error) {
          toast.error(error);
        }
      }
    });
  };

  const officerDashboard = async () => {
    const { data } = await httpService("admin/officerdashboard");

    if (data) {
      setOfficer(data);
    }
  };

  useEffect(() => {
    officerDashboard();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h4" fontWeight={700} color="#44444E">
              Officers
            </Typography>
          </div>
          <div className="row mb-5">
            <div className="col-lg-3 bg-light text-muted rounded p-3 m-1">
              <Typography variant="caption">HR officers</Typography>
              <Typography variant="h4">{officer.hrs}</Typography>
            </div>
            <div className="col-lg-3 bg-light text-muted rounded p-3 m-1">
              <Typography variant="caption">Promotion officers</Typography>
              <Typography variant="h4">{officer.promotions}</Typography>
            </div>
            <div className="col-lg-3"></div>
          </div>
          <div className="col-lg-4">
            <div className="mb-4">
              <Alert severity="info">Create a new officer account</Alert>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  select
                  required
                >
                  {roles.map((role, i) => (
                    <MenuItem value={role} key={i}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {officer.role === "HR" && (
                <div className="mb-3">
                  <TextField
                    fullWidth
                    label="MDA"
                    name="mda"
                    onChange={handleChange}
                    select
                    required
                  >
                    {mdas.sort().map((mda, i) => (
                      <MenuItem value={mda} key={i}>
                        {mda}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              )}
              <div className="mb-4">
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  required
                  onChange={handleChange}
                  type={passwordType ? "text" : "password"}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setPasswordType(!passwordType)}
                          >
                            {passwordType ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
              <div>
                <Button variant="contained" type="submit" color="error">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOfficers;
