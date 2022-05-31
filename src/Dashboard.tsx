import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import useAuth from './useAuth';
import SpotifyWebApi from "spotify-web-api-node";
import { BoxArrowInUpRight, CaretLeft, CaretRight, Heart, HeartFill } from "react-bootstrap-icons";


const spotifyApi = new SpotifyWebApi({
    clientId: "ceb94033180d45b781fb17de6036b363"
});

// let tracks = new Array<Track>();

interface DashboardProps {
    code: string,
}

export interface Track {
    artist: string,
    title: string,
    uri: string,
    albumUrl: string,
    previewUrl?: string,
    link: string,
    id: string,
}
export default function Dashboard({ code }: DashboardProps) {
    const accessToken = useAuth(code);


    // const [search, setSearch] = useState("");
    // const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [playingTrackInd, setPlayingTrackInd] = useState<number>(-1);
    const [liked, setLiked] = useState(false);
    const playingAudio = useRef<HTMLAudioElement>();
    const tracks = useRef<Array<Track>>([]);








    useEffect(() => {


        if (tracks.current.length === 0) return;
        // if (playingTrackInd < 0) {
        //     setPlayingTrackInd(0);
        //     return;
        // }
        // if (playingTrackInd >= tracks.length) {
        //     setPlayingTrackInd(tracks.length - 1);
        //     return;
        // }

        playingAudio?.current?.pause();
        playingAudio?.current?.remove();
        const newAudio = new Audio(tracks.current[playingTrackInd].previewUrl);
        newAudio.play();
        newAudio.loop = true;
        playingAudio.current = newAudio;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playingTrackInd]);



    // function chooseTrack(track: Track) {
    //     setPlayingTrack(track);
    //     setSearch('');
    // }











    const getRandomTrack = useCallback((callback?: Function) => {

        // A list of all characters that can be chosen.
        const characters = 'abcdefghijklmnopqrstuvwxyz';

        // Gets a random character from the characters string.
        const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
        let randomSearch = '';

        // Places the wildcard character at the beginning, or both beginning and end, randomly.
        switch (Math.round(Math.random())) {
            case 0:
                randomSearch = randomCharacter + '%';
                break;
            case 1:
                randomSearch = '%' + randomCharacter + '%';
                break;
        }
        spotifyApi.searchTracks(randomSearch, {
            offset: Math.floor(Math.random() * 1000),
            limit: 1,
            market: "US",
        }).then((result) => {
            const track = result.body?.tracks?.items[0];


            if (track?.preview_url == null) {
                getRandomTrack(callback);

            } else {
                const newTrack: Track = {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: track.album.images[1].url,
                    previewUrl: track.preview_url,
                    link: track.external_urls.spotify,
                    id: track.id,

                }
                tracks.current.push(newTrack);
                // setTracks(prevTracks => prevTracks.concat(newTrack));
                if (callback) {
                    callback();

                }

            }
        })
    }, []);

    const prevSong = useCallback(() => {
        if (playingTrackInd > 0) {
            setPlayingTrackInd(prevInd => prevInd - 1);
            setLiked(false);

        }
    }, [playingTrackInd]);

    const nextSong = useCallback(() => {
        if (playingTrackInd + 3 >= tracks.current.length - 1) { // if we are within three songs from end
            if (playingTrackInd === tracks.current.length - 1) {  // they clicked too fast and got to the last one

                getRandomTrack(() => setPlayingTrackInd(prevInd => prevInd + 1));

            }
            else {
                setPlayingTrackInd(prevInd => prevInd + 1);

            }

            getRandomTrack();
            getRandomTrack();
            getRandomTrack();
            getRandomTrack();


        }
        else {
            setPlayingTrackInd(prevInd => prevInd + 1)

        }
        setLiked(false);
    }, [getRandomTrack, playingTrackInd]);

    const handleKeyUp = useCallback((e: any) => {


        if (e.keyCode === 39) {

            // right arrow pressed
            // getRandomTrack();
            nextSong();

        }
        else if (e.keyCode === 37) { // left arrrow key pressed

            prevSong();
        }
        // getRandomTrack();
    }, [prevSong, nextSong]);

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, [handleKeyUp]);

    function openInSpotify() {
        window.open(tracks.current[playingTrackInd].link);
    }


    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);

        if (playingTrackInd === -1) {  // if this is first time
            getRandomTrack(() => setPlayingTrackInd(0));
        }
        getRandomTrack();
        getRandomTrack();
        getRandomTrack();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const likeSong = useCallback(() => {
        spotifyApi.addToMySavedTracks([tracks.current[playingTrackInd].id]).then((res) => {
            console.log(res.body);
            console.log("liked song");
            setLiked(true);
        })
    }, [playingTrackInd]);

    const unLikeSong = useCallback(() => {
        spotifyApi.removeFromMySavedTracks([tracks.current[playingTrackInd].id]).then((res) => {
            console.log(res.body);
            console.log("unliked song");
            setLiked(false);
        })
    }, [playingTrackInd]);

    console.log(playingTrackInd)

    console.log(tracks)

    // TODO this uses absolutely horrendous bootstrap styling. somebody please redo this whole thing
    return (
        <Container className="d-flex flex-column py-2 justify-content-center align-items-left" style={{ height: "100vh" }} onKeyUp={handleKeyUp}>
            {/* <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={(e => setSearch(e.target.value))}
            /> */}
            {/* <Row className="  ml-100">
                <Col className=" ml-100 ">
                    <h5 className="display-1  ml-100  fixed-top" style={{ fontSize: 30, color: "black" }}>Jively.</h5>

                </Col>

            </Row> */}

            {(tracks.current.length > 0 && playingTrackInd >= 0) &&
                <Row className="d-flex justify-content-center align-items-center">
                    <Col className=" float-right" lg={1}> {/*float not working*/}
                        <Row>
                            <CaretLeft className='pb-100' color='white' size={100} onClick={prevSong} style={{ cursor: "pointer" }} fill="white" />

                        </Row>
                    </Col>
                    <Col xs={1} md={1} lg={1}></Col>
                    <Col>
                        <img
                            src={tracks.current[playingTrackInd].albumUrl}
                            alt="loading"
                            style={{ height: "50vh", width: "50vh" }}
                            className="mx-auto"
                        />
                        <div className='text-white'>
                            <h4>{tracks.current[playingTrackInd].title}</h4>
                        </div>
                        <div className='text-white'>{tracks.current[playingTrackInd].artist}</div>
                    </Col>
                    {/* <Col>
                            <div>
                                some text here
                            </div>
                        </Col> */}
                    {/* <Col lg={1}></Col> */}
                    {/* <Col lg={1}></Col> */}
                    <Col className="= flex-column  justify-content-center align-items-left text-white text-center" lg={5} >

                        <Row className="pb-5 no-gutters align-items-center text-left justify-content-left  " style={{ cursor: "pointer" }} >
                            <Col lg={1} className="pr-0 ">
                                {(!liked) ?
                                    <Heart color='white' size={40} onClick={likeSong} />
                                    : <HeartFill color='white' size={40} onClick={unLikeSong} />}
                            </Col>

                            <Col lg={5} className="text-left align-text-left d-flex justify-content-left">
                                {(!liked) ?
                                    <div className="h9"> &nbsp;&nbsp; Add to Liked Songs</div>
                                    : <div className="h9">  &nbsp;&nbsp; Remove from Liked Songs</div>}

                            </Col>
                            <Col lg={20}></Col>
                        </Row>
                        <Row ></Row>
                        <Row className="pb-5 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={openInSpotify} >
                            <Col lg={1} className="pr-0 ">
                                <BoxArrowInUpRight color='white' size={40} />
                            </Col>

                            <Col lg={4} className="ml-0 text-left d-flex justify-content-left">
                                <div className="h9">&nbsp;&nbsp;&nbsp;Open in Spotify</div>
                            </Col>
                            <Col lg={20}></Col>
                        </Row>
                    </Col>
                    <Col className=" float-right" lg={1}> {/*float not working*/}
                        <Row>
                            <CaretRight className='pb-100' color='white' size={200} onClick={nextSong} style={{ cursor: "pointer" }} />

                        </Row>
                    </Col>

                </Row >
            }
            {/* <div className='flex-grow-1 my-2' style={{ overflowY: "auto" }}>
                {searchResults.map((track: Track) => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
            </div> */}
        </Container >
    );
}
