let accessToken;
const clientID = '2fae32f84faf4be887950feec1804499';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken(){
    if(accessToken){
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessURL;
    }
  },

  search(term){
    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    return fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
        return response.json();
      }).then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        url: track.uri
      }));
    });
  },

  savePlaylist(nameOfPlaylist, arrayOfTrackURIs){
    if(!nameOfPlaylist || !arrayOfTrackURIs.length){
      return;
    }
    let userID;
    let userURL = 'https://api.spotify.com/v1/me';
    let playlistID;
    const accessToken = Spotify.getAccessToken();
    const authorization = {Authorization: `Bearer ${accessToken}`};

    return fetch(userURL,{
      headers: authorization
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
              method: 'POST',
              headers: authorization,
              body: JSON.stringify({
                  name: nameOfPlaylist
              })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
              method: 'POST',
              headers: authorization,
              body: JSON.stringify({
                uris: arrayOfTrackURIs
          })
        });
      });
    });
  }
};

export default Spotify;
