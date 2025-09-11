import { Typography } from "@mui/material";
import logo from "../assets/logo.png";

function FooterComponents() {
  return (
    <div
      className="d-flex align-items-center text-white"
      style={{ minHeight: "15vh", backgroundColor: "#44444E" }}
    >
      <div className="container w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <img
              src={logo}
              alt="logo"
              className="d-inline-block align-top me-2"
              height={70}
            />
          </div>
          <div>
            <div>
              <Typography variant="body2" fontWeight={700}>
                Developed by Joint Admissions and Matriculation Board (JAMB)
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                All rights reserved &copy; {new Date().getFullYear()}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterComponents;
