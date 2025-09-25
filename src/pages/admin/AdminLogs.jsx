import React, { useEffect, useState } from "react";
import { httpService } from "../../httpService";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLogs, setAllLogs] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("admin/adminlogs", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      //console.log(data);
      setLogs(data.logs);
      setAllLogs(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "account",
      headerName: "Account",
      width: 200,
      renderCell: (param) => (
        <span className="text-capitalize">
          {param.value?.firstName} {param.value?.lastName}
        </span> // full uppercase
      ),
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (param) => (
        <span className="text-capitalize">
          {`${new Date(param.value).toDateString("en-NG")},
            ${new Date(param.value).toLocaleTimeString()}`}
        </span>
      ),
    },
  ];
  return (
    <div>
      <div className="p-3 overflow-scroll">
        <div className="container">
          <div className="mb-4">
            <div className="row">
              <div className="col-lg-3">
                <Typography variant="h4" fontWeight={700} color="#44444E">
                  All Logs
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={logs}
            columns={columns}
            rowCount={allLogs}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminLogs;
