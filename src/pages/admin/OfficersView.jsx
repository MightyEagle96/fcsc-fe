import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { DataGrid } from "@mui/x-data-grid";

function OfficersView() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState([]);

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService(`admin/adminstaff/${slug}`);

    if (data) {
      //console.log(data);
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
        <span className="text-uppercase">{params.value}</span> // full uppercase
      ),
    },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="">
          <div className="mb-4 container">
            <Typography variant="h4" fontWeight={700} color="#44444E">
              <span className="text-uppercase">{slug}</span> Officers
            </Typography>
          </div>
          <div className="p-3" style={{ height: 600, width: "100%" }}>
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
    </div>
  );
}

export default OfficersView;
