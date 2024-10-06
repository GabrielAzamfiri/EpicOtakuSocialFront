import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { inputSearchAction } from "../redux/actions";

const TopBar = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const search = useSelector(state => state.input.input); //TODO: ON SUBMIT -> OTHER PAGE WITH SEARCHED INFO

  const handleSearch = e => {
    e.preventDefault();
    dispatch(inputSearchAction(input));
  };

  return (
    <Navbar expand="lg" id="navbar " variant="dark">
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
                setInput(e.target.value);
              }}
              value={input}
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
