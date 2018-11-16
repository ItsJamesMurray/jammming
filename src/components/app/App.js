import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify/Spotify';

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
      //   {
      //   name: "We're All Gonna Die",
      //   artist: 'Dawes',
      //   album: "We're All Gonna Die",
      //   id: 1
      // }
    ],
      playlistName: 'Enter Playlist Name',
      playlistTracks: [
      //   {
      //   name: 'One of Us',
      //   artist: 'Dawes',
      //   album: "We're All Gonna Die",
      //   id: 2
      // } ,
      // {
      //   name: 'Havana',
      //   artist: 'Blake Mills',
      //   album: 'Hi Ho',
      //   id: 3
      // }

    ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let newTracks = this.state.playlistTracks.map(track => track);

    if(this.state.playlistTracks.find(savedTrack =>
        savedTrack.id === track.id)) {
      return;
    } else {
      newTracks.push(track);
      this.setState({playlistTracks: newTracks})
    }
  }

  removeTrack(track){
    let newTracks = this.state.playlistTracks.map(track => track);

    if(this.state.playlistTracks.find(savedTrack =>
        savedTrack.id === track.id)) {
      newTracks.pop(track);
      this.setState({playlistTracks: newTracks})
    }
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('My Playlist')

  }

  search(term){
    Spotify.search(term)
      .then(searchResults => this.setState({
        searchResults: searchResults
    }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch = {this.search}
          />
          <div className="App-playlist">
            <SearchResults
                searchResults = {this.state.searchResults}
                addOn = {this.addTrack}
            />
            <Playlist
                name = {this.state.playlistName}
                tracks = {this.state.playlistTracks}
                onNameChange = {this.updatePlaylistName}
                onSave = {this.savePlaylist}
                onRemove = {this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
