import {useEffect, useContext, useState} from 'react';


const FetchSongs = async (usernameOne, usernameTwo, sessionToken, overwhelmedCallback) => {
   
    const token = sessionToken;
    const userOneId = usernameOne;
    const userTwoId = usernameTwo;
    

    async function getPlaylistsInLibrary(user_id){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        const resp = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists?limit=50`, {
            method: 'GET',
            headers: {
                "Authorization" : "Bearer " + sessionToken
            },
        })
        const status = resp.status;
        
        if (status !== 200) {
            throw new Error(user_id + ' is invalid');
        }
        
        const data = await resp.json();
        
        return data.items;
        
    }

    async function getAllSongs(userData) {
        const limit = 50;
        
        async function fetchAllTracks(endpoint) {
            let allTracks = [];
            let offset = 0;
            let hasMore = true;
    
            while (hasMore) {
                const url = `${endpoint}?limit=${limit}&offset=${offset}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Authorization" : "Bearer " + sessionToken
                    },
                });
                const data = await response.json();
                allTracks = allTracks.concat(data.items.map(item => item.track));
                offset += limit;
                hasMore = data.items.length === limit;
            }
    
            return allTracks;
        }
    
        const numTrackCheck = userData.reduce((acc, curr) => {
            acc = acc + curr.tracks.total;
            return acc;
        },0)
        
        if (numTrackCheck >= 10000) {
            overwhelmedCallback(true);
            // communiticate to home.jsx that a boolean is true ex. overwhelm
        }
        

        const trackEndpoints = userData.map(data => data.tracks.href);
        const fetchPromises = trackEndpoints.map(endpoint => fetchAllTracks(endpoint));
        
        // Wait for all fetch calls to complete
        const allResults = await Promise.all(fetchPromises);
        
        // Flatten the results into a single array
        const allTracks = allResults.flat();
        
        console.log("ALL TRACKS", allTracks);
        return allTracks;
    }
    
    if (userOneId.length <= 0 || userTwoId.length <= 0) {
        throw new Error('Two Ids must be entered.')
    }
    const userOneData = await getPlaylistsInLibrary(userOneId);
    const userTwoData = await getPlaylistsInLibrary(userTwoId);
    
    
    const userOneAllSongs = await getAllSongs(userOneData);
    const userTwoAllSongs = await getAllSongs(userTwoData);

    
    
    //const userTwoData = await getPlaylistsInLibrary(userTwoId);

    // MAKE SO THAT SCREEN HAS A LOAD SYMBOL WHEN THIS DATA IS BEING MATCHED THROUGH REACT STATE VARIABLES
    // MAKE IT SO THAT ACCOUNTS WITH OVER 10,000 songs do not work 



    return {
        userOneSongs: userOneAllSongs,
        userTwoSongs: userTwoAllSongs
    }
}

export default FetchSongs;