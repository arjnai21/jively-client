import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';


const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=ceb94033180d45b781fb17de6036b363&response_type=code&redirect_uri=http://https://arjnai21.github.io/jively-client/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played"

export default function Login() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row >

                <Col className=" align-items-center justify-content-center text-center">
                    <Row >
                        <h1 className="display-1" style={{ fontSize: "1", color: "black" }}>Jively.</h1>

                    </Row>
                    <Row lg={5}>
                        <br></br>
                    </Row>
                    <Row>
                        <a className="btn btn-success btn-lg" style={{ width: "300px" }} href={AUTH_URL}> Login With Spotify</a>
                    </Row>
                </Col>
            </Row>

        </Container>
    );
}


