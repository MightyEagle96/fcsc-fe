import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { appColors, appLogo } from "../assets/appTheme";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../contexts/AppUserContext";
import { Login, Logout } from "@mui/icons-material";
import { httpService } from "../httpService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavbarComponent() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminLinks = [
    { path: "/admin/dashboard", text: "Home" },
    { path: "/admin/officers", text: "Officers" },
    { path: "/admin/candidates", text: "Candidates" },
    {
      path: `/admin/promorecommended/`,
      text: "Recommended",
    },
    {
      path: `/admin/approvedcandidates/`,
      text: "Approved",
    },
    {
      path: `/admin/searchcandidate/`,
      text: "Search Candidate",
    },
  ];

  const hrLinks = [
    { path: "/admin/dashboard", text: "Home" },
    { path: `/admin/hrcandidates/${user?.mda}`, text: "Candidates" },
    {
      path: `/admin/recommendedcandidates/${user?.mda}`,
      text: "Recommended ",
    },
  ];
  const promotionLinks = [
    { path: "/admin/dashboard", text: "Home" },

    {
      path: `/admin/promorecommended/`,
      text: "Recommended",
    },
    {
      path: `/admin/approvedcandidates/`,
      text: "Approved",
    },
  ];

  const candidateLinks = [
    { path: "/", text: "Home" },
    { path: "/myprofile", text: "My Profile" },
    { path: "/datacorrection", text: "Data Correction" },
  ];

  // ✅ Centralized link resolver
  const getLinks = () => {
    if (!user) return [];
    if (user.role === "admin" && user.specificRole === "admin")
      return adminLinks;
    if (user.role === "admin" && user.specificRole === "hr") return hrLinks;
    if (user.role === "admin" && user.specificRole === "promotion")
      return promotionLinks;
    if (user.role === "candidate") return candidateLinks;
    return [];
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await httpService("logout");
      if (data) {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const links = getLinks();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user && user.role === "admin" ? "/admin/dashboard" : "/")
          }
          style={{ cursor: "pointer" }}
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
            {links.map((c, i) => (
              <Nav.Link key={i} as={Link} to={c.path}>
                <Typography variant="body2">{c.text}</Typography>
              </Nav.Link>
            ))}
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
                  variant="body2"
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
                <Typography variant="body2">Login</Typography>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
