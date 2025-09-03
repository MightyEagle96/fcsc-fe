import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";

function OfficersView() {
  const { slug } = useParams();

  const [officers, setOfficers] = useState([]);

  const getData = async () => {
    const { data } = await httpService(`admin/adminstaff/${slug}`);

    if (data) {
      setOfficers(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      renderCell: (params) => (
        <span className="text-capitalize">{params.value}</span> // full uppercase
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    {
      field: "mda",
      headerName: "MDA",
      width: 200,
      renderCell: (params) => (
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          <div className="mb-4">
            <Typography variant="h4" fontWeight={700} color="#44444E">
              <span className="text-uppercase">{slug}</span> Officers
            </Typography>
          </div>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row._id}
              rows={officers}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficersView;
