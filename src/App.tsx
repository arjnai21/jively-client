import React from 'react';
import './custom.scss';
import Login from "./Login";
import Home from "./Home";

const code = new URLSearchParams(window.location.search).get('code');
const refreshToken = localStorage.getItem('refreshToken');
console.log("code in the app file is running")
function App() {

    return (

        (code || refreshToken) ? <Home code={code} refreshToken={refreshToken}  ></Home> : <Login />
    );
}

export default App;
