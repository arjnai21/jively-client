import React, { useState, useEffect } from "react";
import SpotifyWebPlayer from "react-spotify-web-playback";

//@ts-ignore
export default function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackUri]);
    return <SpotifyWebPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
            if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUri ? [trackUri] : []} />
}