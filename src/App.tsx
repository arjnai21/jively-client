import React from 'react';
import './custom.scss';
import Login from "./Login";
import Dashboard from "./Dashboard";

const code = new URLSearchParams(window.location.search).get('code');
function App() {
    return (

        code ? <Dashboard code={code}></Dashboard> : <Login />
    );
}

export default App;
