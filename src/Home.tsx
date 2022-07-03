import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import useAuth from './useAuth';
import SpotifyWebApi from "spotify-web-api-node";
import Switch from "react-switch";


// TODO figure out why it loads so slow on first go

// also make some cool animation or somethin
import { BoxArrowInUpRight, CaretLeft, CaretRight, Heart, HeartFill, PlusCircleDotted, VolumeMute, VolumeUp } from "react-bootstrap-icons";
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

export interface Playlist {
    name: string,
    uri: string,
    imageUrl: string,
    link: string,
    id: string,
    selected: boolean,
}

export interface SpotifyUser {
    displayName?: string,
    id: string,
}

export default function Home({ code, refreshToken }: HomeProps) {
    const accessToken = useAuth(code, refreshToken);


    // TODO maybe extrapolate all of these into some kind of state object -> store it in localstorage?
    const [playingTrackInd, setPlayingTrackInd] = useState<number>(-1);
    const [liked, setLiked] = useState(false);
    const [muted, setMuted] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(true);
    const [autoplay, setAutoPlay] = useState(false);
    const [searchGenres, setSearchGenres] = useState(new Set());

    const playingAudio = useRef<HTMLAudioElement>();
    const tracks = useRef<Array<Track>>([]);
    const trackTitleSet = useRef<Set<string>>(new Set());
    const playlists = useRef<Array<Playlist>>([]);
    const user = useRef<SpotifyUser>();



    const [backgroundRGB, setBackgroundRGB] = useState<Array<number>>([254, 234, 217]);
    var luma = 0.299 * backgroundRGB[0] + 0.587 * backgroundRGB[1] + 0.114 * backgroundRGB[2];  ///get brightness. ntsc formula
    let elementColor = (luma > 130) ? 'black' : "white";
    let spotifyLogo = (luma > 130) ? spotifyLogoBlack : spotifyLogoWhite;
    // TODO not just black or white, but a different color in the album color palette


    // populate genres and playlists on component mount
    useEffect(() => {
        const previousSearchGenres = localStorage.getItem('previousSearchGenres');
        if (previousSearchGenres) {
            setSearchGenres(new Set(JSON.parse(previousSearchGenres)));
        }
    }, []);






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
        if (autoplay) {
            newAudio.onended = nextSong;
        }
        else {
            newAudio.loop = true;
        }

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

    useEffect(() => {
        if (playingAudio.current) {
            if (autoplay) {
                playingAudio.current.onended = nextSong;
                playingAudio.current.loop = false;
            }
            else {
                playingAudio.current.onended = null;
                playingAudio.current.loop = true;
            }
        }

    }, [autoplay, nextSong]);





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

        spotifyApi.getMe().then((userResp) => {
            user.current = {
                id: userResp.body.id,
                displayName: userResp.body.display_name
            }

            playlists.current.length = 0;

            // get playlists 50 at a time. if there's more than 200, idc
            // TODO this is an awful way to do this
            for (let i = 0; i < 4; i++) {
                spotifyApi.getUserPlaylists({
                    limit: 50,
                    offset: i * 50
                }).then((playlistsResp) => {
                    playlistsResp.body.items.forEach((playlist) => {
                        if (playlist.owner.id !== userResp.body.id) {
                            return;
                        }
                        playlists.current.push({
                            name: playlist.name,
                            uri: playlist.uri,
                            imageUrl: playlist.images[0]?.url,
                            link: playlist.external_urls.spotify,
                            id: playlist.id,
                            selected: false,

                        });
                    });
                });

            }


        });




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

    const addSongToPlaylists = useCallback(() => {
        playlists.current.forEach((playlist) => {
            if (!playlist.selected) return;
            spotifyApi.addTracksToPlaylist(playlist.id, [tracks.current[playingTrackInd].uri]).then(() => {
                // console.log("added tracks");
            });
        });
    }, [playingTrackInd]);

    // spotifyApi.getUserPlaylists().then((playlists) => {
    //     console.log(playlists);
    // });

    // spotifyApi.playli
    // const togglePlayListModal = useCallback(() => {
    //     // let modal = new Modal(document.getElementById("playlistModal"));
    //     // document.getElementById("playlistModal")
    //     $("playlistModal").

    // }, []);

    function openModal() {
        const backdrop = document.getElementById("backdrop");
        const playlistModal = document.getElementById("playlistModal");
        if (backdrop) {
            backdrop.style.display = "block"

        }
        if (playlistModal) {
            playlistModal.style.display = "block"
            playlistModal.classList.add("show")
        }

    }
    function closeModal() {
        const backdrop = document.getElementById("backdrop");
        const playlistModal = document.getElementById("playlistModal");
        if (backdrop) {
            backdrop.style.display = "none"

        }
        if (playlistModal) {
            playlistModal.style.display = "none"
            playlistModal.classList.remove("show")
        }


    }

    function togglePlaylistModal() {
        const playlistModal = document.getElementById("playlistModal");
        if (playlistModal) {
            if (playlistModal.style.display === "none") {
                openModal();
            }
            else {
                closeModal();
            }
        }
    }
    // Get the modal
    var modal = document.getElementById('playlistModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal()
        }
    }


    // TODO this uses absolutely horrendous bootstrap styling. somebody please learn bootstrap and redo this whole thing
    return (
        <Container fluid className="d-flex flex-column py-2 justify-content-center align-items-left" style={{ maxHeight: "auto", minHeight: "100vh", backgroundColor: 'rgb(' + backgroundRGB.join(',') + ')', }} onKeyUp={handleKeyUp}>
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
            <Row >
                <Col></Col>
                <Col sm={1} md={1} lg={1} xs={1} className="p-2">
                    <Button className='btn-primary btn-sm' onClick={() => {
                        window.localStorage.removeItem("refreshToken");
                        window.location.href = "/";
                    }}>log out</Button>

                </Col>
                <Col sm={.5} md={.5} lg={.5} xs={.5}></Col>


            </Row>
            <Row className='justify-content-center'>

                <Col sm={11} lg={11} md={11} className='d-flex flex-wrap' >

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
            </Row>
            {
                (tracks.current.length > 0 && playingTrackInd >= 0) ?
                    <Row className="d-flex justify-content-center align-items-center p-5">
                        <Col xs={2} sm={2} md={1} lg={1}> {/*float not working*/}
                            {/* <Row> */}
                            <CaretLeft className='pb-100' color={elementColor} size={50} onClick={prevSong} style={{ cursor: "pointer" }} fill={elementColor} />

                            {/* </Row> */}
                        </Col>
                        <Col xs={8} sm={8} md={7} lg={5} >
                            <div className='text-left'>
                                <img className='d-block mx-auto py-3' src={spotifyLogo} alt='' width={'150px'} onClick={() => window.open('https://open.spotify.com')} style={{ cursor: "pointer" }}></img>
                            </div>
                            <img
                                src={tracks.current[playingTrackInd].albumUrl}
                                alt="loading"
                                crossOrigin='anonymous'
                                className="d-block mx-auto img-fluid "
                                id='albumImage'
                                onLoad={function () {
                                    const img = document.getElementById('albumImage');
                                    const colorThief = new ColorThief();
                                    const backgroundColor = colorThief.getPalette(img)[2]
                                    setBackgroundRGB(backgroundColor);
                                }}
                            />
                            <div className={'text-' + elementColor}>
                                <h4 className='text-center'>{tracks.current[playingTrackInd].title}</h4>
                            </div>
                            <div className={`text-${elementColor} text-center`}>
                                {tracks.current[playingTrackInd].artist}
                            </div>
                        </Col>

                        <Col xs={2} sm={2} md={1} lg={1} className="p-0 m-0">
                            <CaretRight color={elementColor} className="p-0 m-0" size={50} onClick={nextSong} style={{ cursor: "pointer" }} />
                        </Col>


                        <Col className={" py-5 text-center outline text-" + elementColor} xs={11} sm={11} lg={3} md={4}  >

                            <Row className="pb-4 no-gutters align-items-center text-left justify-content-left  " onClick={(!liked) ? likeSong : unLikeSong} style={{ cursor: "pointer" }} >
                                <Col xs={3} sm={3} lg={3} className="pr-0 ">
                                    {(!liked) ?
                                        <Heart color={elementColor} size={40} className='outline' />
                                        : <HeartFill color={elementColor} size={40} />}
                                </Col>

                                <Col xs={9} sm={9} lg={9} className="text-left align-text-left d-flex justify-content-left">
                                    {(!liked) ?
                                        <div className="h9 outline"> &nbsp;&nbsp; add to liked songs</div>
                                        : <div className="h9">  &nbsp;&nbsp; remove from liked songs</div>}

                                </Col>
                            </Row>
                            <Row className="pb-4 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={openInSpotify} >
                                <Col xs={3} sm={3} lg={3} className="pr-0 ">
                                    <BoxArrowInUpRight color={elementColor} size={40} />
                                </Col>

                                <Col xs={9} sm={9} lg={9} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;open in spotify</div>
                                </Col>
                            </Row>
                            <Row className="pb-4 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={muteAudio} >
                                <Col xs={3} sm={3} lg={3} className="pr-0 ">
                                    {(!muted) ? < VolumeUp color={elementColor} size={40} /> : <VolumeMute color={elementColor} size={40} />}
                                </Col>

                                <Col xs={9} sm={9} lg={9} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;{(muted) ? "unmute" : "mute"}</div>
                                </Col>
                            </Row>
                            <Row className="pb-4 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={togglePlaylistModal} >
                                <Col xs={3} sm={3} lg={3} className="pr-0 ">
                                    {< PlusCircleDotted color={elementColor} size={40} />}
                                </Col>

                                <Col xs={9} sm={9} lg={9} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;add to playlist</div>
                                </Col>
                            </Row>
                            <Row className="pb-4 no-gutters align-items-center text-left d-flex justify-content-left " style={{ cursor: "pointer" }} onClick={() => setAutoPlay((prevAutoPlay: boolean) => !prevAutoPlay)} >
                                <Col xs={3} sm={3} lg={3} className="pr-0 ">
                                    {/* <div className='custom-control custom-switch'> </div> */}
                                    <Switch checked={autoplay} onChange={() => console.log()}></Switch>
                                    {/* <input type="checkbox" className="custom-control-input" id="customSwitch1" /> */}
                                    {/* <label className="custom-control-label" htmlFor="customSwitch1">Toggle this switch element</label></div> */}
                                    {/* {(!muted) ? < VolumeUp color={elementColor} size={40} /> : <VolumeMute color={elementColor} size={40} />} */}
                                </Col>

                                <Col xs={9} sm={9} lg={9} className="ml-0 text-left d-flex justify-content-left">
                                    <div className="h9">&nbsp;&nbsp;&nbsp;{"autoplay"}</div>
                                </Col>
                            </Row>

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
            {/* <!-- Modal --> */}
            {/* <button type="button" className="btn btn-primary" onClick='openModal()'>
                Launch demo modal
            </button> */}
            <div className="modal fade" id="playlistModal" tabIndex={-1} aria-labelledby="ModalLabel" aria-modal="true"
                role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add to playlist</h5>
                            {/* <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                                <span aria-hidden="true">×</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            {playlists.current.map((playlist) => {
                                return <div key={playlist.id}>
                                    <input className="form-check-input m-1" type="checkbox" value="" id="flexCheckDefault" onClick={() => {
                                        playlist.selected = !playlist.selected;
                                        // console.log(playlists.current);

                                    }} />
                                    {playlist.name}
                                </div>

                            })}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" onClick={() => {
                                closeModal();
                                // reset playlist selections
                                playlists.current.forEach((playlist) => playlist.selected = false);
                                document.querySelectorAll('input[type="checkbox"]')
                                    //@ts-ignore
                                    .forEach(el => el.checked = false);

                            }}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                closeModal();
                                addSongToPlaylists();
                            }}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" id="backdrop" style={{ display: "none" }}></div>

        </Container >
    );
}
