const MatchData = async (data, sessionToken) => {

    // Global variables
    const userOneData = data.userOneSongs;
    const userTwoData = data.userTwoSongs;
    const token = sessionToken;

    const userOneTracks = filterData(userOneData); // remove duplicate songs
    const userTwoTracks = filterData(userTwoData); // remove duplicate songs
    const sharedTracks = getSharedTracks(); // song objects list
    const sharedArtists = getSharedArtists(); // object of shared artists objects list and shared percentage
    const sharedGenres = await getSharedGenres(); // object of shared Genre string list and shared percentage

    console.log("hhhhhhhhhhhhhh",userOneTracks);
    console.log("hhhhhhhhhhhhhh", userTwoTracks);
    console.log(sharedTracks);
    console.log(sharedArtists);
    console.log(sharedGenres);

    function filterData(userData) {
        const userTracks = userData.filter(Boolean);
        const userTrackSet = [...new Set(userTracks)];

        function getUniqueTracksByTrackName(tracks) {
            const seenTracksNames = new Set();
            const uniqueTracks = [];
        
            tracks.forEach(track => {
                const trackName = track.name; 
                if (trackName && !seenTracksNames.has(trackName)) {
                    seenTracksNames.add(trackName);
                    uniqueTracks.push(track);
                }
            });
    
            return uniqueTracks;
        }

        return getUniqueTracksByTrackName(userTrackSet);
    }
    
    function getSharedTracks() {
        const set = new Set(userOneTracks.map(track => track.name));
        const sharedTracksList = userTwoTracks.filter(track => set.has(track.name));

        // get total unique tracks
        const uniqueTracks = [...new Set((userOneTracks.map(track => track.name)).concat(userTwoTracks.map(track => track.name)))];

        // get percentage
        const percentage = ((sharedTracksList.length / uniqueTracks.length) * 100).toFixed(1);

        return {
            sharedTracksList: sharedTracksList,
            percentage: percentage,
            uniqueTracks: uniqueTracks
        };
    }
    
    function getSharedArtists() {

        function getUniqueArtistsByArtistName(artists) {
            const seenArtistNames = new Set();
            const uniqueArtists = [];
        
            artists.forEach(artist => {
                const artistName = artist.name; 
        
                if (artistName && !seenArtistNames.has(artistName)) {
                    seenArtistNames.add(artistName);
                    uniqueArtists.push(artist);
                }
            });
    
            return uniqueArtists;
        }

        function getSharedArtistsByArtistName(artistsOne, artistsTwo) {
            const artistsOneNames = new Set(artistsOne.map(artist => artist.name));
            const sharedArtistsNames = new Set();
            const sharedArtists = new Set();

            artistsTwo.forEach(artist => {
                const artistName = artist.name;
                if (artistName && artistsOneNames.has(artistName) && !sharedArtistsNames.has(artistName)) {
                    sharedArtistsNames.add(artistName);
                    sharedArtists.add(artist);
                }
            });

            return [...sharedArtists];
        }
        
        // get all unique artists from both users
        const userOneArtists = getUniqueArtistsByArtistName(userOneTracks.map(track => track.artists[0]));
        const userTwoArtists = getUniqueArtistsByArtistName(userTwoTracks.map(track => track.artists[0]));

        // get total unique artists
        const uniqueArtists = [...new Set((userOneArtists.map(artist => artist.name)).concat(userTwoArtists.map(artist => artist.name)))];
    
        // get shared unique artists
        const sharedArtistsList = getSharedArtistsByArtistName(userOneArtists, userTwoArtists);
       
        // get percentage
        const percentage = ((sharedArtistsList.length / uniqueArtists.length) * 100).toFixed(1)
        
        return {
            sharedArtistsList: sharedArtistsList,
            percentage: percentage,
            uniqueArtists: uniqueArtists
        }
    }

    async function getSharedGenres() {
        // get all unique artists details from each user
        const userOneArtists = [...new Set(userOneTracks.map(track => track.artists[0]))];
        const userTwoArtists = [...new Set(userTwoTracks.map(track => track.artists[0]))];

        // Get all unique genres from each user
        const userOneGenres = [...new Set((await getArtistDetails(userOneArtists)).flatMap(item => item.artists).flatMap(item => item.genres))];
        const userTwoGenres = [...new Set((await getArtistDetails(userTwoArtists)).flatMap(item => item.artists).flatMap(item => item.genres))];

        // Get total unique genres
        const uniqueGenres = [...new Set(userOneGenres.concat(userTwoGenres))];
      
        // Get shared genres
        const set = new Set(userOneGenres);
        const sharedGenresList = userTwoGenres.filter(genre => set.has(genre));
   
        // Get shared percentage
        const percentage = ((sharedGenresList.length / uniqueGenres.length) * 100).toFixed(1);
      

        async function getArtistDetails(artists) {
            const endpoints = artists.map(artist => {
                if (artist && artist.id) {
                    return artist.id;
                } 
            })
            const chunkedEndpoints = chunkArray(endpoints, 50);
    
            const fetchPromises = chunkedEndpoints.map(chunk => {
                const batch = chunk.join(',');
                return fetchAllArtistData(batch);
            });
    
            const allResults = await Promise.all(fetchPromises);
            return allResults;
        }

        function chunkArray(array, chunkSize) {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        }

        async function fetchAllArtistData(endpoint) {
            try {
                const response = await fetch("https://api.spotify.com/v1/artists?ids=" + endpoint, {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        }

        return {
            sharedGenresList: sharedGenresList,
            percentage: percentage,
            uniqueGenres: uniqueGenres
        }
    }
    

    
    return {
        sharedTracks: sharedTracks,
        sharedArtists: sharedArtists,
        sharedGenres: sharedGenres
    }
        
}

export default MatchData;
