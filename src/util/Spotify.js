const USER_ID = "c2ef2fbeff584df1aa61224a2ff74140"
//const REDIRECT_URI ="http://localhost:3000/"
const accessURIBase = "https://accounts.spotify.com/authorize"
let accessToken;
const REDIRECT_URI = 'https://ChaseBtest.surge.sh'


let Spotify ={
  getAccessToken() {
      if (accessToken) {
        return accessToken;
      }
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); //checks the url, matches access_token
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); //checks the url, matches expires_in
      if (accessTokenMatch && expiresInMatch) { //if both the above return true
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000); //clears everyone else to go again.
        window.history.pushState('Access Token', null, '/');
    return accessToken;
  } else {
    const accessURI = `${accessURIBase}?client_id=${USER_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    window.location = accessURI;
  }
  },
  search: function(term){
      Spotify.getAccessToken();
      const fetchUrl = `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${term}`;
      return fetch(fetchUrl,
        {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.tracks){
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
        }
      });
    }, //end search method

  savePlaylist(name, trackURIs) {
      if (!name || !trackURIs) return;
      const accessToken = Spotify.getAccessToken();
      const headers = {Authorization: `Bearer ${accessToken}`};
      const createPlaylistHeaders = {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name}) };
      const addTracksHeaders = {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({'uris': trackURIs,}) };
      let userID, playlistID;
      return fetch('https://api.spotify.com/v1/me', {headers: headers}) //get spotify user id
      .then(response => response.json())
      .then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, createPlaylistHeaders) //add playlist
          .then(response => response.json())
          .then(jsonResponse => {
            playlistID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, addTracksHeaders)//add tracks
          });
      });
    },
}
export default Spotify;
