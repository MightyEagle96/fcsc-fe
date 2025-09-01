import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { appColors, appLogo } from "../assets/appTheme";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../contexts/AppUserContext";
import { Login, Logout } from "@mui/icons-material";
import { httpService } from "../httpService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
function NavbarComponent() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminLinks = [
    { path: "/admin/dashboard", text: "Home" },
    { path: "/admin/officers", text: "Officers" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    const { data } = await httpService("logout");

    if (data) {
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user && user.role === "admin" ? "/admin/dashboard" : "/")
          }
        >
          <div className="d-flex align-items-center">
            <img
              alt=""
              src={appLogo}
              height="30"
              className="d-inline-block align-top me-2"
            />{" "}
            <span
              style={{
                color: appColors.primary2,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              FCSC
            </span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user.role === "admin" && (
              <>
                {adminLinks.map((c, i) => (
                  <Nav.Link key={i} onClick={() => navigate(c.path)}>
                    <Typography variant="caption">{c.text}</Typography>
                  </Nav.Link>
                ))}
              </>
            )}
            {/* <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <Button
                onClick={handleLogout}
                loading={loading}
                loadingPosition="end"
                color="error"
                endIcon={<Logout />}
              >
                <Typography
                  variant="caption"
                  sx={{ textTransform: "capitalize" }}
                >
                  Logout
                </Typography>
              </Button>
            ) : (
              <Button
                color="error"
                endIcon={<Login />}
                sx={{ textTransform: "capitalize" }}
                onClick={() => navigate("/")}
              >
                <Typography variant="caption">Login</Typography>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
