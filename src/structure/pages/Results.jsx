import React, { useContext, useState, useEffect } from 'react';
import InfoContext from "../../contexts/InfoContext.js";
import { Row, Col, Button, Card } from 'react-bootstrap';
import DoughnutChart from '../../DoughnutChart.jsx';

function Results() {
    const [info, setInfo] = useContext(InfoContext);
    const [loading, setLoading] = useState(true);
    const [showing1, setShowing1] = useState(false);
    const [showing2, setShowing2] = useState(false);
    const [showing3, setShowing3] = useState(false);

    useEffect(() => {
        const storedInfo = sessionStorage.getItem('info');
        if (storedInfo) {
            setInfo(JSON.parse(storedInfo));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!info || !info.sharedSongs || !info.sharedArtists || !info.sharedGenres) {
        return <div>Error loading data</div>;
    }

    const matchedSongs = info.sharedSongs;
    const matchedArtists = info.sharedArtists.artists;
    const matchedGenres = info.sharedGenres.allSharedGenres;

    const DonutChartSongData = [info.sharedSongs.length, info.totalSongs - info.sharedSongs.length];
    const DonutChartArtistData = [info.sharedArtists.artists.length, info.totalArtists - info.sharedArtists.artists.length];
    const DonutChartGenreData = [info.sharedGenres.allSharedGenres.length, info.totalGenres - info.sharedGenres.allSharedGenres.length];

    return (
        <>
            <div>
                <div style={{
                    backgroundColor: '#1DB954',
                    width: '100vw', 
                    margin: '0 auto', 
                    padding: '1rem 0',
                    boxSizing: 'border-box', 
                }}>
                    <Row style={{ margin: '0' }}>
                        <h2 style={{ textAlign: 'center' }}>Matched:</h2>
                    </Row>
                    <Row style={{ margin: '0' }}>
                        <Col style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '8rem', paddingBottom: '0' }}>{info.sharedSongs.length}</p>
                            <p style={{ fontSize: '2rem', paddingTop: '0', margin: '0', marginTop: '-2rem' }}>Songs</p>
                            <Card style={{ marginTop: '1rem', border: 'none'}}>
                                <Button style ={{outline: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#535353',
                                    borderColor: '#535353',}}
                                    onClick={() => {
                                        setShowing1(prev => !prev);
                                    }}>
                                    {showing1 ? <p style ={{margin: '0', padding: '0'}}>Hide Songs</p>: <p style={{margin: '0', padding: '0'}}>Show Songs</p>}
                                </Button>
                                {showing1 && (
                                    <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#fff',
                                        borderRadius: '4px'
                                    }}>
                                        {matchedSongs.map((song, index) => (
                                            <p key={index}><a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer">{song.name}</a></p>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '8rem', paddingBottom: '0' }}>{info.sharedArtists.artists.length}</p>
                            <p style={{ fontSize: '2rem', paddingTop: '0', margin: '0', marginTop: '-2rem' }}>Artists</p>
                            <Card style={{ marginTop: '1rem', border: 'none' }}>
                                <Button style ={{outline: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#535353',
                                    borderColor: '#535353',}}
                                    onClick={() => {
                                        setShowing2(prev => !prev);
                                    }}>
                                    {showing2 ? <p style ={{margin: '0', padding: '0'}}>Hide Artists</p>: <p style={{margin: '0', padding: '0'}}>Show Artists</p>}
                                </Button>
                                {showing2 && (
                                <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#fff',
                                        borderRadius: '4px'
                                    }}>
                                        {matchedArtists.map((artist, index) => (
                                            <p key={index}><a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></p>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '8rem', paddingBottom: '0' }}>{info.sharedGenres.allSharedGenres.length}</p>
                            <p style={{ fontSize: '2rem', paddingTop: '0', margin: '0', marginTop: '-2rem' }}>Genres</p>
                            <Card style={{ marginTop: '1rem', border: 'none' }}>
                                <Button style ={{outline: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#535353',
                                    borderColor: '#535353',}}
                                    onClick={() => {
                                        setShowing3(prev => !prev);
                                    }}>
                                    {showing3 ? <p style ={{margin: '0', padding: '0'}}>Hide Genres</p>: <p style={{margin: '0', padding: '0'}}>Show Genres</p>}
                                </Button>
                                {showing3 && (
                                    <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#fff',
                                        borderRadius: '4px'
                                    }}>
                                        {matchedGenres.map((genre, index) => (
                                            <p key={index}>{genre}</p>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{margin: '1rem'}}>
                    <h1>Match Rating: </h1>
                    <br></br>
                    <Row className="justify-content-center">
                        <Col className="d-flex justify-content-center align-items-center" xs={12} sm={12} md={6} lg={4} xl={4}>
                            <DoughnutChart 
                                data={DonutChartSongData} 
                                sharedAmount={info.sharedSongs.length} 
                                totalAmount={info.totalSongs} 
                                title={"Shared Song Percentage"} 
                                labels={['Shared Songs', 'Total Songs']}
                                label={'# of Songs'}
                            />
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" xs={12} sm={12} md={6} lg={4} xl={4}>
                            <DoughnutChart 
                                data={DonutChartArtistData} 
                                sharedAmount={info.sharedArtists.artists.length} 
                                totalAmount={info.totalArtists} 
                                title={"Shared Artist Percentage"} 
                                labels={['Shared Artists', 'Total Artists']}
                                label={'# of Artists'}
                            />
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" xs={12} sm={12} md={6} lg={4} xl={4}>
                            <DoughnutChart 
                                data={DonutChartGenreData} 
                                sharedAmount={info.sharedGenres.allSharedGenres.length} 
                                totalAmount={info.totalGenres} 
                                title={"Shared Genre Percentage"} 
                                labels={['Shared Genres', 'Total Genres']}
                                label={'# of Genres'}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Results;
