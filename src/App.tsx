import React from 'react';
import './custom.scss';
import Login from "./Login";
import Home from "./Home";

const code = new URLSearchParams(window.location.search).get('code');
function App() {
    return (

        code ? <Home code={code} ></Home> : <Login />
    );
}

export default App;
