import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const TopBar = () => {
  const [value, setValue] = useState("");

  const handleSearch = e => {
    e.preventDefault();
    console.log("Search value:", value);
  };
  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Top Anime</Nav.Link>
            <NavDropdown title="Genres" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Adventure</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Fantasy</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Kids</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form onSubmit={handleSearch} className="d-flex ">
            <Form.Control
              onChange={e => {
                setValue(e.target.value);
              }}
              value={value}
              width={500}
              type="search"
              placeholder="Search"
              className="me-2 "
              aria-label="Search"
            />
            <Button type="submit" variant="dark">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
