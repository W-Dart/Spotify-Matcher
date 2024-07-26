const MatchData = async (data, sessionToken) => {
    const userOneData = data.userOneSongs;
    const userTwoData = data.userTwoSongs;

    const token = sessionToken;

    console.log('User One Data:', userOneData);
    console.log('User Two Data:', userTwoData);

    const sharedSongs = getSharedSongs(userOneData, userTwoData);
    console.log('SHARED SONGS', sharedSongs)
    const sharedArtists = getSharedArtists(userOneData, userTwoData);
    const genreMatches = await getSharedGenres(sharedArtists.artists);

    const totalSongs = userOneData.length + userTwoData.length;
    const totalArtists = JSON.parse(JSON.stringify(totalSongs));


    function getSharedSongs(userOneData, userTwoData) {
        const hashMap = new Map();
        userOneData.forEach((track, index) => {
            if (track) {
                hashMap.set(track.name, true);
            } else {
                console.log(`Skipping an entry in userOneData at index ${index} for a null song:`, track);
            }
        });

        const nameMatches = userTwoData.filter((track, index) => {
            if (track && track.name) {
                return hashMap.has(track.name);
            } else {
                console.log(`Skipping an entry in userTwoData at index ${index} for a null song:`, track);
                return false;
            }
        });

        return nameMatches;
    }

    function getSharedArtists(userOneData, userTwoData) {
        const hashMap = new Map();
        userOneData.forEach((track) => {
            if (track) {
                hashMap.set(track.artists[0].id, track.artists[0]);
            } else {
                console.log("Skipping an entry in userOneData for a null song");
            }
        });

        const artistMatches = userTwoData.filter((track) => {
            if (track && track.artists[0].id) {
                return hashMap.has(track.artists[0].id);
            } else {
                console.log("Skipping an entry in userTwoData for a null song");
                return false;
            }
        });
        const artistMatchNames = artistMatches.map(match => match.artists[0].name);
        const topArtists = getTopThreeElements(artistMatchNames);

        const artistList = [];
        const artistNamesSet = new Set();

        artistMatches.forEach(match => {
            const artist = match.artists[0];
            if (!artistNamesSet.has(artist.name)) {
                artistList.push(artist);
                artistNamesSet.add(artist.name);
            }
        });

        return {artists: artistList, topThreeArtists: topArtists}
            
    }

    function getTopThreeElements(arr) {
        
        const countMap = new Map();
        arr.forEach(item => {
            countMap.set(item, (countMap.get(item) || 0) + 1);
        });
    
        const sortedElements = [...countMap.entries()].sort((a, b) => b[1] - a[1]);
        const topThree = sortedElements.slice(0, 3).map(entry => entry[0]);
    
        return topThree;
    }

    // FOR GETTING GENRE FROM FURTHER ARTIST DATA
    // GENRE FUNCTIONS START
    async function getSharedGenres(sharedArtists) {
        console.log('YIPEEEEE', sharedArtists);
        const results = await getArtistDetails(sharedArtists);
        const genreLists = results.flatMap(result => result.artists.flatMap(artist => {
            if (artist && artist.genres) {
                return artist.genres;
            }
        }));

        const topGenres = getTopThreeElements(genreLists);
        console.log("Top three genres: ", topGenres);

        const allGenres = [];
        for (let i = 0; i < genreLists.length; i++) {
            if (!allGenres.includes(genreLists[i])) {
                allGenres.push(genreLists[i]);
            }
        }

        
        return {topThreeGenres: topGenres, allSharedGenres: allGenres};
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
            console.log("HERE", data);
            return data;
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    }

    function chunkArray(array, chunkSize) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }

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
    /// GENRE FUNCTIONS END

   

    console.log('SHARED ARTISTS', sharedArtists);
    console.log('GENRE MATCHES', genreMatches);

    async function getUserGenres(userData) {
     
        const artists = userData.map(track => {
            if (track) {
                return track.artists[0];
            }
        })

        const details = await getSharedGenres(artists);
        return details;
    }

    const userOneGenres = await getUserGenres(userOneData);
    const userTwoGenres = await getUserGenres(userTwoData);
    const allGenres = userOneGenres.allSharedGenres.length + userTwoGenres.allSharedGenres.length;
  

    return {
        sharedSongs: sharedSongs,
        sharedArtists: sharedArtists,
        sharedGenres: genreMatches,
        totalSongs: totalSongs,
        totalArtists: totalArtists,
        totalGenres: allGenres
    }
}

export default MatchData;
