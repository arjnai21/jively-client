import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';


const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=ceb94033180d45b781fb17de6036b363&response_type=code&redirect_uri=" + process.env.REACT_APP_REDIRECT_URI + "&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played"

const logo = require('./assets/jively_logo.png')

export default function Login() {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row className="d-flex justify-content-center align-items-center">

                {/* <Col className=" d-flex align-items-center justify-content-center text-center"> */}
                {/* <Row md={12} lg={12}> */}
                <Col md={12} lg={12} className="d-flex justify-content-center align-items-center">
                    <img src={logo} alt="" width="400vw" />
                </Col>
                {/* </Row> */}
                {/* <Row >
                        <h1 className="display-1" style={{ fontSize: "1", color: "black" }}>Jively.</h1>

                    </Row> */}
                <Row>
                    <br></br>
                </Row>
                {/* <Row> */}
                <Col lg={12} className="d-flex justify-content-center align-items-center">
                    <a className="btn btn-dark btn-lg" style={{ width: "300px" }} href={AUTH_URL} rel="noreferrer"> Login With Spotify</a>
                </Col>
                {/* </Row> */}
                {/* </Col> */}
            </Row>

        </Container>
    );
}


