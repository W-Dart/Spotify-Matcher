import React from 'react';
import {useRef, useState, useContext, useEffect} from 'react';
import {Form, Row, Col, Button, Card} from 'react-bootstrap'
import UsernameContext from "../../contexts/UsernameContext.js";
import InfoContext from "../../contexts/InfoContext.js";
import MatchData from '../../MatchData.js'
import { useNavigate } from 'react-router-dom';

import FetchSongs from "../../FetchSongs.js";

function Home() {
    const CLIENT_ID = "94107853945547cd960095669b080e7f";
    const CLIENT_SECRET = "033f7acb4df14dd5864901c9c5c1669b";
    const [token, setToken] = useState('');

    const { usernameOne, usernameTwo } = useContext(UsernameContext);
    const [overwhelmed, setOverwhelmed] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    //const [info, setInfo] = useState(null);
    const [info, setInfo] = useContext(InfoContext);
    const [invalid, setInvalid] = useState(false);


    const navigate = useNavigate();
   

     // Initialize API Token
     useEffect(()=> {
        fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET
        }).then(res => {
            console.log(res.status);
            return res.json();
        })
        .then(data => {
            console.log(data);
            setToken(data.access_token)
            
        })
     },[])

    async function getInfo(userOne, userTwo, token) {
        try {
            const data = await FetchSongs(userOne, userTwo, token, setOverwhelmed);
            const results = await MatchData(data, token);
            return results;
        } catch (error) {
            alert(error.message);
            setInvalid(true);

        }
        
        
    }

  

    function handleClick(resultData) {
        console.log("Setting info:", resultData);
        setInfo(resultData);
        sessionStorage.setItem('info', JSON.stringify(resultData));
        setDataLoading(false);
        if (!invalid) {
            navigate('/results');
        }
        
    }

    return (
        <div>
            <Row>
               <Col xs={12} md={4} >
                <div>
                    <h1>Welcome to Spotify Matcher!</h1>
                    <p>Enter yours and someone else's spotify user id/username to compare shared music withing your public playlists!</p>
                    <h5><strong>How can I find a user id?</strong></h5>
                    <p>1. Head to your own or another profile page on Spotify and click on the 3 dots below the profile name.</p>
                    <p>2. Select Share from the menu and click Copy link to artist.</p>
                    <p>3. Paste this link into a browser. The Spotify User ID is the <strong>string of characters located between /user/ and ?</strong></p>
                    <br></br>
                    <h5>Note: </h5>
                    <p>A spotify user id may be the same or different as a display name for a profile. Refer to the instructions above to get the right id.</p>
                </div>
                </Col>
                <Col>
                    <div>
                    <Form>
                        <Form.Label htmlFor="inputUsernameOne">User Id #1</Form.Label>
                        <Form.Control 
                        id="inputUsernameOne"
                        ref={usernameOne}
                        />
                    </Form>
                    <Form>
                        <Form.Label htmlFor="inputUsernameTwo">User Id #2</Form.Label>
                        <Form.Control 
                        id="inputUsernameTwo"
                        ref={usernameTwo}
                        />
                    </Form>
                    <Button
                        style={{marginTop: 10}}
                        type="submit"
                        onClick={async () => {

                            console.log(usernameOne.current.value + usernameTwo.current.value)
                            setDataLoading(true);
                            
                            const resultData = await getInfo(usernameOne.current.value, usernameTwo.current.value, token);
                            handleClick(resultData);
                            
                            
                            
                        }}
                    >
                        Enter Usernames
                    </Button>

                </div>
                <br></br>
                
                <div>

                        {dataLoading ? (
                            <p>Data is loading...</p>
                        ) : (
                            <></>
                        )}  
                </div>
                </Col>
            </Row>
            <Row>
                {/* If info boolean is true, show the two usernames, then the date scrollable */}
                {overwhelmed && (
                    <p>LOADING</p>
                )}
            </Row>


        </div>
    )
}

export default Home;