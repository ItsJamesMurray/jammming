let accessToken = ''//enter accessToken here
const clientID = '2fae32f84faf4be887950feec1804499';
const redirectURI = 'http://jamesmurray_jammming.surge.sh';

const Spotify = {

  getAccessToken(){
    let url = window.location.href;
    let tokenRegex = /access_token=([^&]*)/;
    let expirationRegex = /expires_in=([^&]*)/;

    if(accessToken){
      return accessToken;
    } else if (url.match(tokenRegex)){
      accessToken = url.match(tokenRegex);
      let expiresIn = url.match(expirationRegex);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      url = '';
    } else {
      window.location(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`)
    }
  },

  search(term){
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    fetch(endpoint, {
      method: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      if(response.ok){
        return response.json();
      } throw new Error('Request Failed!');
    }, networkError => {
      console.log(networkError.message);
    }).then(track => {
      track.map([{
        id: track.id,
        name: track.name,
        artist: track.artist[0].name,
        album: track.album.name,
        url: track.uri
      }])
    })
  },

  savePlaylist(nameOfPlaylist, arrayOfTrackURIs){
    if(!nameOfPlaylist || !arrayOfTrackURIs){
      return
    }
    let authorization = {headers: {Authorization: `Bearer ${accessToken}`}};
    let userID = '';
    let userURL = 'https://api.spotify.com/v1/me';
    let playlistID = '';

    fetch(userURL,{
      headers: authorization
    }).then(response => {
      response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
    }).then(()=>{
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
        method: 'POST',
        headers: authorization,
        body: JSON.stringify({
            name: nameOfPlaylist
        })
      }).then(response => {
        response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
      }).then(() => {
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks
`,{
          method: 'POST',
          headers: authorization,
          body: JSON.stringify({
            uris: arrayOfTrackURIs
          })
        })
      })
    })

  }
}

export default Spotify;
