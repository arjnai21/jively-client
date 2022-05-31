import React, { useEffect, useState } from 'react';

import axios from 'axios';

export default function useAuth(code: unknown) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        console.log("using effect");
        axios.post("http://localhost:3001/login", {
            code,
        }).then(res => {
            // res.data.expiresIn = 70;
            console.log(res.data);
            window.history.pushState({}, "", "/");
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
        }).catch((err) => {
            console.log("got error frmo api");
            console.log(err);
            // window.location.href =  "/";
        });
    }, [code]);

    useEffect(() => {

        if (!refreshToken || !expiresIn) {
            console.log(refreshToken);
            console.log(expiresIn);
            return;
        }
        const interval = setInterval(() => {
            axios.post("http://localhost:3001/refresh", {
                refreshToken,
            }).then(res => {
                // res.data.expiresIn = 70;
                console.log(res.data);
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
                // window.history.pushState({}, null, "/");
                // setAccessToken(res.data.accessToken);
                // setRefreshToken(res.data.resfreshToken);
                // setExpiresIn(res.data.expiresIn);
            }).catch((err) => {
                console.log("got error frmo api");
                console.log(err);
                // window.location.href =  "/";
            });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);


    }, [refreshToken, expiresIn]);
    return accessToken;
}
