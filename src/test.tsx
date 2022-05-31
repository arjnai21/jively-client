// import React, { useEffect, useRef, useState } from 'react';
// import { Container, Form, } from 'react-bootstrap';
// import useAuth from './useAuth';
// import SpotifyWebApi from "spotify-web-api-node";
// // import TrackSearchResult from './TrackSearchResult';
// // import Player from './Player';

// const spotifyApi = new SpotifyWebApi({
//     clientId: "Client Id"
// });


// interface DashboardProps {
//     code: string,
// }

// export interface Track {
//     artist: string,
//     title: string,
//     uri: string,
//     albumUrl: string,
//     previewUrl?: string,
// }
// export default function Dashboard({ code }: DashboardProps) {
//     const accessToken = useAuth(code);
//     const [playingTrackInd, setPlayingTrackInd] = useState<number>(-1);
//     const tracks = useRef<Array<Track>>([]);

//     useEffect(() => {
//         document.addEventListener('keyup', handleKeyUp);

//     }, []);


//     // this function always has playingTrackInd as -1, even when the state has been updated by setPlayingTrackInd
//     function handleKeyUp(e: any) {
//         if (e.keyCode === 39) {
//             // right arrow pressed
//             if (playingTrackInd === tracks.current.length - 1) {
//                 getRandomTrack(() => setPlayingTrackInd(prevInd => prevInd + 1));
//             }
//             else {
//                 setPlayingTrackInd(prevInd => prevInd + 1)

//             }

//         }
//         else if (e.keyCode === 37) { // left arrrow key pressed
//             console.log("pressed left")
//             console.log(playingTrackInd)

//             if (playingTrackInd > 0) {
//                 console.log("tryna go back")
//                 setPlayingTrackInd(prevInd => prevInd - 1);

//             }
//         }
//     }

//     // function that gets random track and adds it to tracks
//     function getRandomTrack(callback?: Function) {


//         getRandomTrackFromApi().then((result) => {
//             const track = result.body?.tracks?.items[0];

//             const newTrack: Track = {
//                 artist: track.artists[0].name,
//                 title: track.name,
//                 uri: track.uri,
//                 albumUrl: track.album.images[1].url,
//                 previewUrl: track.preview_url
//             }
//             tracks.current.push(newTrack);
//             if (callback) {
//                 callback();

//             }

//         })
//     }


//     useEffect(() => {
//         if (!accessToken) return;
//         spotifyApi.setAccessToken(accessToken);

//         if (playingTrackInd === -1) {
//             getRandomTrack(() => setPlayingTrackInd(0));
//         }
//         getRandomTrack();
//         getRandomTrack();


//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [accessToken]);

//     return (
//         (component that depends on tracks[playingTrackInd]
//     );
// }

export { };