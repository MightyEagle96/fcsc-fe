import { Button, Menu, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Person } from "@mui/icons-material";
import { Modal } from "react-bootstrap";
import { roles } from "./AdminOfficers";
import { mdas } from "./data";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function OfficersView() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [staff, setStaff] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService(`admin/adminstaff/${slug}`);

    if (data) {
      setOfficers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First Name",

      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "mda",
      headerName: "MDA",
      flex: 1,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value || "-"}</span> // full uppercase
      ),
    },
    {
      field: "_id",
      headerName: "VIEW",
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => getStaff(params.value)} endIcon={<Person />}>
          <Typography variant="caption" textTransform={"capitalize"}>
            View Staff
          </Typography>
        </Button>
      ),
    },
  ];

  const getStaff = async (id) => {
    setLoading(true);
    const { data } = await httpService(`admin/viewindividualstaff/`, {
      params: { id: id },
    });

    if (data) {
      setStaff(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setStaff((prev) => ({
        ...prev,
        role: value,
        mda: value === "HR" ? prev.mda : "", // keep mda only if role === HR
      }));
    } else {
      setStaff((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const deleteStaff = () => {
    Swal.fire({
      icon: "question",
      title: "Delete desk officer",
      text: "Are you sure you want to delete this desk officer's account?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        const { data, error } = await httpService("admin/deleteaccount", {
          params: { id: staff._id },
        });

        if (data) {
          getData();
          toast.success(data);
          setStaff(null);
        }

        if (error) {
          toast.error(error);
        }
        setDeleting(false);
      }
    });
  };

  const updateStaff = () => {
    Swal.fire({
      icon: "question",
      title: "Update Desk Officer",
      text: "Are you sure you want to update this desk officer's account?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdating(true);

        const { data, error } = await httpService.patch(
          "admin/updateofficer",
          staff
        );

        if (data) {
          getData();
          toast.success(data);
          setStaff(null);
        }

        if (error) {
          toast.error(error);
        }
        // console.log(staff);

        setUpdating(false);
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="">
          <div className="mb-4 container">
            <Typography variant="h4" fontWeight={700} color="#44444E">
              <span className="text-uppercase">{slug}</span> Officers
            </Typography>
          </div>
          <div className="p-3" style={{ height: 800, width: "100%" }}>
            <DataGrid
              loading={loading}
              getRowId={(row) => row._id}
              rows={officers}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[20, 50, 100]}
            />
          </div>
        </div>
      </div>
      {staff && (
        <Modal onHide={() => setStaff(null)} size="lg" show={staff}>
          <Modal.Header closeButton>
            <Modal.Title>View Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-3">
              <div className="col-lg-6">
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={staff.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={staff.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    value={staff.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={staff.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    onChange={handleChange}
                    select
                    value={staff.role}
                    required
                  >
                    {roles.map((role, i) => (
                      <MenuItem value={role} key={i}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                {staff.role === "HR" && (
                  <div className="mb-3">
                    <TextField
                      fullWidth
                      label="MDA"
                      name="mda"
                      onChange={handleChange}
                      select
                      required
                      value={staff.mda}
                    >
                      {mdas.map((mda, i) => (
                        <MenuItem value={mda} key={i}>
                          {mda}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              loading={updating}
              variant="contained"
              onClick={updateStaff}
            >
              Save Changes
            </Button>
            <Button loading={deleting} onClick={deleteStaff} color="error">
              Delete Staff account
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default OfficersView;
