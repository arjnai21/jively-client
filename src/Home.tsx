import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import useAuth from './useAuth';
import SpotifyWebApi from "spotify-web-api-node";
import Switch from "react-switch";


// TODO figure out why it loads so slow on first go

// also make some cool animation or somethin
import { BoxArrowInUpRight, CaretLeft, CaretRight, Heart, HeartFill, VolumeMute, VolumeUp } from "react-bootstrap-icons";
//@ts-ignore
import ColorThief from "colorthief";

const spotifyLogoWhite = require('./assets/Spotify_Logo_RGB_White.png');
const spotifyLogoBlack = require('./assets/Spotify_Logo_RGB_Black.png');
// const logo = require('./assets/jively_logo.png')




const spotifyApi = new SpotifyWebApi({
    clientId: "ceb94033180d45b781fb17de6036b363"
});

const genres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]

// let tracks = new Array<Track>();

interface HomeProps {
    code: string | null,
    refreshToken: string | null,
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

export default function Home({ code, refreshToken }: HomeProps) {
    const accessToken = useAuth(code, refreshToken);


    // TODO maybe extrapolate all of these into some kind of state object
    const [playingTrackInd, setPlayingTrackInd] = useState<number>(-1);
    const [liked, setLiked] = useState(false);
    const [muted, setMuted] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(true);
    const [searchGenres, setSearchGenres] = useState(new Set());

    // const [searchGenres, setSearchGenres] = useState({
    //     "acoustic": false,
    //     "afrobeat": false,
    //     "alt-rock": false,
    //     "alternative": false,
    //     "ambient": false,
    //     "anime": false,
    //     "black-metal": false,
    //     "bluegrass": false,
    //     "blues": false,
    //     "bossanova": false,
    //     "brazil": false,
    //     "breakbeat": false,
    //     "british": false,
    //     "cantopop": false,
    //     "chicago-house": false,
    //     "children": false,
    //     "chill": false,
    //     "classical": false,
    //     "club": false,
    //     "comedy": false,
    //     "country": false,
    //     "dance": false,
    //     "dancehall": false,
    //     "death-metal": false,
    //     "deep-house": false,
    //     "detroit-techno": false,
    //     "disco": false,
    //     "disney": false,
    //     "drum-and-bass": false,
    //     "dub": false,
    //     "dubstep": false,
    //     "edm": false,
    //     "electro": false,
    //     "electronic": false,
    //     "emo": false,
    //     "folk": false,
    //     "forro": false,
    //     "french": false,
    //     "funk": false,
    //     "garage": false,
    //     "german": false,
    //     "gospel": false,
    //     "goth": false,
    //     "grindcore": false,
    //     "groove": false,
    //     "grunge": false,
    //     "guitar": false,
    //     "happy": false,
    //     "hard-rock": false,
    //     "hardcore": false,
    //     "hardstyle": false,
    //     "heavy-metal": false,
    //     "hip-hop": false,
    //     "holidays": false,
    //     "honky-tonk": false,
    //     "house": false,
    //     "idm": false,
    //     "indian": false,
    //     "indie": false,
    //     "indie-pop": false,
    //     "industrial": false,
    //     "iranian": false,
    //     "j-dance": false,
    //     "j-idol": false,
    //     "j-pop": false,
    //     "j-rock": false,
    //     "jazz": false,
    //     "k-pop": false,
    //     "kids": false,
    //     "latin": false,
    //     "latino": false,
    //     "malay": false,
    //     "mandopop": false,
    //     "metal": false,
    //     "metal-misc": false,
    //     "metalcore": false,
    //     "minimal-techno": false,
    //     "movies": false,
    //     "mpb": false,
    //     "new-age": false,
    //     "new-release": false,
    //     "opera": false,
    //     "pagode": false,
    //     "party": false,
    //     "philippines-opm": false,
    //     "piano": false,
    //     "pop": false,
    //     "pop-film": false,
    //     "post-dubstep": false,
    //     "power-pop": false,
    //     "progressive-house": false,
    //     "psych-rock": false,
    //     "punk": false,
    //     "punk-rock": false,
    //     "r-n-b": false,
    //     "rainy-day": false,
    //     "reggae": false,
    //     "reggaeton": false,
    //     "road-trip": false,
    //     "rock": false,
    //     "rock-n-roll": false,
    //     "rockabilly": false,
    //     "romance": false,
    //     "sad": false,
    //     "salsa": false,
    //     "samba": false,
    //     "sertanejo": false,
    //     "show-tunes": false,
    //     "singer-songwriter": false,
    //     "ska": false,
    //     "sleep": false,
    //     "songwriter": false,
    //     "soul": false,
    //     "soundtracks": false,
    //     "spanish": false,
    //     "study": false,
    //     "summer": false,
    //     "swedish": false,
    //     "synth-pop": false,
    //     "tango": false,
    //     "techno": false,
    //     "trance": false,
    //     "trip-hop": false,
    //     "turkish": false,
    //     "work-out": false,
    //     "world-music": false
    // });


    const playingAudio = useRef<HTMLAudioElement>();
    const tracks = useRef<Array<Track>>([]);
    const trackTitleSet = useRef<Set<string>>(new Set());


    const [backgroundRGB, setBackgroundRGB] = useState<Array<number>>([254, 234, 217]);
    var luma = 0.299 * backgroundRGB[0] + 0.587 * backgroundRGB[1] + 0.114 * backgroundRGB[2];  ///get brightness. ntsc formula
    let elementColor = (luma > 130) ? 'black' : "white";
    let spotifyLogo = (luma > 130) ? spotifyLogoBlack : spotifyLogoWhite;
    // TODO not just black or white, but a different color in the album color palette


    // populate genres on component mount
    useEffect(() => {
        const previousSearchGenres = localStorage.getItem('previousSearchGenres');
        if (previousSearchGenres) {
            setSearchGenres(new Set(JSON.parse(previousSearchGenres)));
        }
    }
        , []);




    const playMusic = useCallback(() => {
        playingAudio?.current?.play();
        setMusicPlaying(true);

    }, []);

    useEffect(() => {
        localStorage.setItem('previousSearchGenres', JSON.stringify(Array.from(searchGenres)));
    }, [searchGenres]);




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
        if (muted) {
            newAudio.muted = true;

        }
        const startPlayPromise = newAudio.play();
        if (startPlayPromise !== undefined) {
            startPlayPromise.then(() => {
                // Start whatever you need to do only after playback
                // has begun.
            }).catch(error => {
                if (error.name === "NotAllowedError") {
                    // they haven't interacted with site so autoplay is not allowed
                    // showPlayButton(videoElem);
                    setMusicPlaying(false);
                    document.addEventListener('mousedown', playMusic)
                    document.addEventListener('keydown', playMusic)

                } else {
                    // Handle a load or playback error
                }
            });
        }
        // newAudio.muted = false;
        // newAudio.loop = true;
        newAudio.onended = nextSong;

        playingAudio.current = newAudio;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playingTrackInd]);

    const getRandomTrack = useCallback((callback?: Function) => {

        // A list of all characters that can be chosen.
        const characters = 'abcdefghijklmnopqrstuvwxyz';

        // Gets a random character from the characters string.
        let randomQuery = characters.charAt(Math.floor(Math.random() * characters.length));
        // randomly decide to use two characters or one
        if (Math.floor(Math.random() * 2) === 0) {
            randomQuery += characters.charAt(Math.floor(Math.random() * characters.length));

        }
        let randomSearch = '';

        // Places the wildcard character at the beginning, or both beginning and end, randomly.
        switch (Math.round(Math.random())) {
            case 0:
                randomSearch = randomQuery + '%';
                break;
            case 1:
                randomSearch = '%' + randomQuery + '%';
                break;
        }
        // get random genre out of selected genres
        // first reduce to array of selected genres
        if (searchGenres.size > 0) {
            randomSearch += " genre:"
            const genreArray = Array.from(searchGenres);
            randomSearch += genreArray[Math.floor(Math.random() * genreArray.length)]

        }


        spotifyApi.searchTracks(randomSearch, {
            offset: Math.floor(Math.random() * 1000),
            limit: 1,
            market: "US",
        }).then((result) => {
            const track = result.body?.tracks?.items[0];

            if (track?.preview_url == null || trackTitleSet.current.has(track.name)) {
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
                trackTitleSet.current.add(newTrack.title);
                if (callback) {
                    callback();
                }

            }
        })
    }, [searchGenres]);

    const prevSong = useCallback(() => {
        if (playingTrackInd > 0) {
            setPlayingTrackInd(prevInd => prevInd - 1);
            setLiked(false);
            // setMuted(false);
        }
    }, [playingTrackInd]);

    const nextSong = useCallback(() => {
        if (playingTrackInd + 2 >= tracks.current.length - 1) { // if we are within three songs from end
            if (playingTrackInd === tracks.current.length - 1) {  // they clicked too fast and got to the last one

                getRandomTrack(() => setPlayingTrackInd(prevInd => prevInd + 1));
                getRandomTrack();

            }
            else {
                setPlayingTrackInd(prevInd => prevInd + 1);

            }

            getRandomTrack();
            // getRandomTrack();
            // getRandomTrack();
            // getRandomTrack();


        }
        else {
            setPlayingTrackInd(prevInd => prevInd + 1)

        }
        setLiked(false);
        // setMuted(false);
    }, [getRandomTrack, playingTrackInd]);





    function openInSpotify() {
        window.open(tracks.current[playingTrackInd].link);
    }

    const muteAudio = useCallback(() => {
        if (playingAudio && playingAudio.current) {
            playingAudio.current.muted = !playingAudio.current.muted;
            setMuted((prevMuted) => !prevMuted);
        }

    }, []);
    const handleKeyUp = useCallback((e: any) => {


        if (e.keyCode === 39) {

            nextSong();

        }
        else if (e.keyCode === 37) { // left arrrow key pressed

            prevSong();
        }

        else if (e.keyCode === 77) { // 'm' was pressed
            muteAudio();
        }
    }, [prevSong, nextSong, muteAudio]);

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, [handleKeyUp]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);

        if (playingTrackInd === -1) {  // if this is first time
            getRandomTrack(() => setPlayingTrackInd(0));
        }
        getRandomTrack();
        getRandomTrack();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const likeSong = useCallback(() => {
        spotifyApi.addToMySavedTracks([tracks.current[playingTrackInd].id]).then((res) => {
            setLiked(true);
        })
    }, [playingTrackInd]);

    const unLikeSong = useCallback(() => {
        spotifyApi.removeFromMySavedTracks([tracks.current[playingTrackInd].id]).then((res) => {
            setLiked(false);
        })
    }, [playingTrackInd]);

    // TODO this uses absolutely horrendous bootstrap styling. somebody please learn bootstrap and redo this whole thing
    return (
        <Container fluid className="d-flex flex-column py-2 justify-content-center align-items-left" style={{ height: "100vh", backgroundColor: 'rgb(' + backgroundRGB.join(',') + ')', }} onKeyUp={handleKeyUp}>
            {/* <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={(e => setSearch(e.target.value))}
            /> */}
            {/* <Row className="  ml-100">
                <Col className=" ml-100 ">
                    <h5 className="display-1  ml-100  fixed-top" style={{ fontSize: 30, color: "black" }}>Jively.</h5>

                </Col>

            </Row> */}
            {/* TODO figure out where to put this logo and make a png for it */}
            {/* <Row className='fixed-top m40 p-20'>
                <Col md={12} lg={12} className="d-flex justify-content-left align-items-left">
                    <img src={logo} alt="" width="100px" />
                </Col>
            </Row> */}

            {(!musicPlaying) && <Row className='fixed-top m40 p-20'>
                <Col className='p-20'>
                    <div id="alert" className="alert alert-info alert-dismissible fade show float-top p-20" role="alert">
                        <strong>Music not playing?</strong> Tap anywhere to begin.
                        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button> */}
                    </div>
                </Col>
            </Row>}
            <Row>
                <Col>
                </Col>
            </Row>
            <Row>
                <Col></Col>

                <Col className=' d-flex flex-wrap' style={{ gap: "0.75px" }} lg={11}>

                    {genres.map((genre) => {
                        //@ts-ignore
                        return <label className={"btn btn-sm btn-" + ((!searchGenres.has(genre)) ? 'dark' : 'light')} style={{ fontSize: "10px" }} onClick={() => {
                            setSearchGenres((prevGenres) => {
                                if (!prevGenres.delete(genre)) {
                                    prevGenres.add(genre);

                                }

                                // when the genres change, we have to remove everything after the current playing index, then get some more tracks
                                tracks.current.length = playingTrackInd + 1;
                                getRandomTrack();
                                getRandomTrack();
                                return new Set(prevGenres);
                                // this feels inefficient
                                // const newGenres = {...prevGenres}
                                // //@ts-ignore
                                // newGenres[key] = !prevGenres[key]
                                // return newGenres;
                            });
                        }} key={genre}>{genre}</label>

                    })}

                </Col>
                <Col></Col>


            </Row>
            <Row><div className="p-1"></div></Row>
            {
                (tracks.current.length > 0 && playingTrackInd >= 0) ?
                    <Row className="d-flex justify-content-center align-items-center">
                        <Col className=" float-right" xs={1} md={1} lg={1}> {/*float not working*/}
                            {/* <Row> */}
                            <CaretLeft className='pb-100' color={elementColor} size={100} onClick={prevSong} style={{ cursor: "pointer" }} fill={elementColor} />

                            {/* </Row> */}
                        </Col>
                        <Col xs={1} md={1} lg={1}></Col>
                        <Col xs={1} md={5} lg={4} >
                            <div className='text-left'>
                                <img className=' pb-3 pr-3' src={spotifyLogo} alt='' width={'200px'} onClick={() => window.open('https://open.spotify.com')} style={{ cursor: "pointer" }}></img>
                            </div>
                            {/* <div className="p-3">hello</div> */}
                            <img
                                src={tracks.current[playingTrackInd].albumUrl}
                                alt="loading"
                                crossOrigin='anonymous'
                                style={{ height: "50vh", width: "50vh" }}
                                className="mx-auto"
                                id='albumImage'
                                onLoad={function () {
                                    const img = document.getElementById('albumImage');
                                    const colorThief = new ColorThief();
                                    const backgroundColor = colorThief.getPalette(img)[2]
                                    setBackgroundRGB(backgroundColor);
                                }}
                            />
                            <div className={'text-' + elementColor}>
                                <h4>{tracks.current[playingTrackInd].title}</h4>
                            </div>
                            <div className={'text-' + elementColor}>{tracks.current[playingTrackInd].artist}</div>
                        </Col>
                        {/* <Col>
                            <div>
                                some text here
                            </div>
                        </Col> */}
                        {/* <Col lg={1}></Col> */}
                        {/* <Col lg={1}></Col> */}
                        <Col className={"flex-column  justify-content-center align-items-left  text-center outline text-" + elementColor} lg={5} md={4} >

                            <Row className="pb-5 no-gutters align-items-center text-left justify-content-left  " onClick={(!liked) ? likeSong : unLikeSong} style={{ cursor: "pointer" }} >
                                <Col lg={1} className="pr-0 ">
                                    {(!liked) ?
                                        <Heart color={elementColor} size={40} className='outline' />
                                        : <HeartFill color={elementColor} size={40} />}
                                </Col>

                                <Col lg={5} className="text-left align-text-left d-flex justify-content-left">
                                    {(!liked) ?
                                        <div className="h9 outline"> &nbsp;&nbsp; Add to Liked Songs</div>
                                        : <div className="h9">  &nbsp;&nbsp; Remove from Liked Songs</div>}

                                </Col>
                                <Col lg={20}></Col>
                            </Row>
                            <Row ></Row>
                            <Row className="pb-5 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={openInSpotify} >
                                <Col lg={1} className="pr-0 ">
                                    <BoxArrowInUpRight color={elementColor} size={40} />
                                </Col>

                                <Col lg={4} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;Open in Spotify</div>
                                </Col>
                                <Col lg={20}></Col>
                            </Row>
                            <Row className="pb-5 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={muteAudio} >
                                <Col lg={1} className="pr-0 ">
                                    {(!muted) ? < VolumeUp color={elementColor} size={40} /> : <VolumeMute color={elementColor} size={40} />}
                                </Col>

                                <Col lg={4} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;{(muted) ? "Unmute" : "Mute"}</div>
                                </Col>
                                <Col lg={20}></Col>
                            </Row>
                            <Row className="pb-5 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={switchAutoplay} >
                                <Col lg={1} className="pr-0 ">
                                    {/* <div className='custom-control custom-switch'> </div> */}
                                    <Switch checked={true} onChange={() => console.log()}></Switch>
                                    {/* <input type="checkbox" className="custom-control-input" id="customSwitch1" /> */}
                                    {/* <label className="custom-control-label" htmlFor="customSwitch1">Toggle this switch element</label></div> */}
                                    {/* {(!muted) ? < VolumeUp color={elementColor} size={40} /> : <VolumeMute color={elementColor} size={40} />} */}
                                </Col>

                                <Col lg={4} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;{"Autoplay"}</div>
                                </Col>
                                <Col lg={20}></Col>
                            </Row>
                        </Col>
                        <Col className="fixed-end" lg={1} md={1} xs={1}> {/*float and fixed not working*/}
                            {/* <Row className='fixed-right'> */}

                            <CaretRight className='fixed-end' color={elementColor} size={100} onClick={nextSong} style={{ cursor: "pointer" }} />

                            {/* </Row> */}
                        </Col>

                    </Row >
                    : <Row className='d-flex justify-content-center align-items-center'><Col className='d-flex justify-content-center align-items-center'><div className="spinner-grow text-light m-5 " role="status" style={{ width: "5rem", height: "5rem" }}>

                    </div></Col></Row>
            }
            <Row className='fixed-bottom pb-2'>
                <Col className='d-flex justify-content-center align-items-center'>
                    <div className={"text-" + elementColor}  >
                        <strong>Feedback?</strong> Email me at <a href="mailto:arjun@jively.app" className={'link-' + ((elementColor === "black") ? "dark" : "light")}>arjun@jively.app</a>.
                        {/* <strong>Feedback?</strong> Email me at arjun@jively.app. */}
                        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button> */}
                    </div>
                </Col>
            </Row>
            {/* <div className='flex-grow-1 my-2' style={{ overflowY: "auto" }}>
                {searchResults.map((track: Track) => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
            </div> */}
        </Container >
    );
}
