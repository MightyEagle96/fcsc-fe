import React, { useEffect, useState } from "react";
import { httpService } from "../httpService";
import { Table } from "react-bootstrap";
import { CircularProgress, Typography } from "@mui/material";

const subjectData = [
  "ippisNumber",
  "fullName",
  "dateOfBirth",
  "gender",
  "stateOfOrigin",
  "lga",
  "poolOffice",
  "currentMDA",
  "cadre",
  "gradeLevel",
  "dateOfFirstAppointment",
  "dateOfConfirmation",
  "dateOfLastPromotion",
  "phoneNumber",
  "email",
  "stateOfCurrentPosting",
  "year2021",
  "year2022",
  "year2023",
  "year2024",
];
function ViewCandidates() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    //setLoading(true);
    const { data } = await httpService("viewcandidates");

    if (data) {
      setStudent(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="p-3 overflow-scroll">
        <div className="text-center">
          {loading && <CircularProgress size={20} />}
        </div>
        <Table striped bordered>
          <thead>
            <tr>
              <th>S.N</th>
              <th>IPPIS No.</th>
              <th>Full Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>State of Origin</th>
              <th>Local Government Area</th>
              <th>Pool Office</th>
              <th>Current MDA</th>
              <th>Cadre</th>
              <th>Grade Level</th>
              <th>Date of First Appointment</th>
              <th>Date of Confirmation</th>
              <th>Date of Last Promotion</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>State of current posting</th>
              <th>2021</th>
              <th>2022</th>
              <th>2023</th>
              <th>2024</th>
              <th>Default Password</th>
            </tr>
          </thead>
          <tbody>
            {student.map((student, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  {subjectData.map((subject) => {
                    return (
                      <td className="w-50">
                        <Typography variant="body2">
                          {subject === "dateOfBirth" ||
                          subject === "dateOfFirstAppointment" ||
                          subject === "dateOfConfirmation" ||
                          subject === "dateOfLastPromotion"
                            ? new Date(student[subject]).toDateString()
                            : student[subject]}
                          {/* {student[subject]}  */}
                        </Typography>
                      </td>
                    );
                  })}
                  <td>
                    <Typography variant="body2">
                      {student.passwords[0]}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ViewCandidates;
