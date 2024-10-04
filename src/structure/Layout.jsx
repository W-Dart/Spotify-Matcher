import React from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import UsernameContext from "../contexts/UsernameContext.js";
import InfoContext from "../contexts/InfoContext.js";
import { useRef, useState, useEffect } from 'react';

function Layout() {
    const usernameOne = useRef();
    const usernameTwo = useRef();
    const [info, setInfo] = useState([]);

    useEffect(() => {
        console.log("Info updated:", info);
    }, [info]);

    const location = useLocation();
    const isResultsPage = location.pathname === '/results';

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/Spotify-Matcher">Home</Nav.Link>
                        {info && info.sharedArtists && (
                             <Nav.Link as={Link} to="results">Results</Nav.Link>
                        )}
                        <Nav.Link as={Link} to="about">About</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            {isResultsPage ? (
                <InfoContext.Provider value={[info, setInfo]}>
                    <Outlet />
                </InfoContext.Provider>
                
            ) : (
                <Container className="mt-3">
                    <UsernameContext.Provider value={{ usernameOne, usernameTwo }}>
                        <InfoContext.Provider value={[info, setInfo]}>
                            <Outlet />
                        </InfoContext.Provider>
                    </UsernameContext.Provider>
                </Container>
            )}
        </div>
    );
}

export default Layout;
