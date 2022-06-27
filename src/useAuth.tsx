import { useEffect, useState } from 'react';

import axios from 'axios';

export default function useAuth(code: string | null, existingRefreshToken: string | null,) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState(existingRefreshToken);
    const [expiresIn, setExpiresIn] = useState(61); // start expiration every one second

    // console.log("using auth w refresh token");
    // console.log(existingRefreshToken);
    // console.log(5);

    useEffect(() => {
        if (!code) return;
        axios.post(process.env.REACT_APP_SERVER + "/login", {
            code: code,
            redirectUri: process.env.REACT_APP_REDIRECT_URI
        }).then(res => {
            // res.data.expiresIn = 70;
            window.history.pushState({}, "", "/");
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
        }).catch((err) => {
            console.log(err);
            // window.location.href =  "/";
        });
    }, [code]);

    useEffect(() => {


        if (!refreshToken) {
            return;
        }
        const interval = setInterval(() => {
            axios.post(process.env.REACT_APP_SERVER + "/refresh", {
                refreshToken: refreshToken,
                redirectUri: process.env.REACT_APP_REDIRECT_URI
            }).then(res => {
                // res.data.expiresIn = 70;
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
                if (res.data.refreshToken) {
                    setRefreshToken(res.data.refreshToken);
                }

                // window.history.pushState({}, null, "/");
                // setAccessToken(res.data.accessToken);
                // setRefreshToken(res.data.resfreshToken);
                // setExpiresIn(res.data.expiresIn);
            }).catch((err) => {

                console.log(err);
                localStorage.removeItem('refreshToken');
                window.location.href = "/";
            });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);


    }, [refreshToken, expiresIn]);

    useEffect(() => {
        if (!refreshToken) return;
        localStorage.setItem('refreshToken', refreshToken);
    }, [refreshToken]);
    return accessToken;
}
