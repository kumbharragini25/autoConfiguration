import React from 'react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import userIcon from '../assets/MyConfig.png';

export default function AppHeader({ onLogout, loggedInUser }) {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img
            src={userIcon}
            alt="MyConfig Logo"
            style={{
              height: '28px',
              objectFit: 'contain',
              marginRight: '8px'
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="d-flex align-items-center border-0 bg-transparent"
              style={{ boxShadow: 'none' }}
            >
              <FaUserCircle size={22} className="text-primary me-2" />
              <span style={{ fontWeight: 500, color: '#154c79' }}>
                {loggedInUser || 'User'}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#">View Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
