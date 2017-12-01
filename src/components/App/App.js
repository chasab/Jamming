import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../PlayList/PlayList'
import Spotify from '../../util/Spotify'

class App extends Component {
constructor(props){
  super(props);
  this.state= {
    searchResults: [],
      searchTerm: '',
      playlistName: 'New Playlist Name',
      playlistTracks: [],
      tracks: []
  }
this.addTrack = this.addTrack.bind(this);
this.removeTrack = this.removeTrack.bind(this);
this.updatePlaylistName = this.updatePlaylistName.bind(this);
this.savePlaylist = this.savePlaylist.bind(this);
this.search = this.search.bind(this);
}

addTrack(track){
  let onList = this.state.playlistTracks.find(is => is.id === track.id); //create variable to house boolean. do a find on the current playlist to see
  if(!onList){                                                           // if current song matches any on current playlist
    this.setState({playListTracks: this.state.playlistTracks.push(track)});//if the onlist = false pushes the track to the playlist, otherwise does nothing.
  }
}
removeTrack(track){
  const playlistIndex = this.state.playlistTracks.findIndex(t => t.id === track.id);
  if (playlistIndex !== -1){
    this.state.playlistTracks.splice(playlistIndex, 1);
    this.setState({playlistTracks: this.state.playlistTracks});
  }
}
updatePlaylistName(name){
  this.setState({playlistName: name})
}
savePlaylist(){
  Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));
  this.setState({
    searchResults: [],
    playlistName: "New Playlist",
    playlistTracks: []
  });
}


search(term){
  console.log('searching for '+{term})
  Spotify.search(term)
  .then(tracks => {
    this.setState(
      {searchResults: tracks,
      });
  })

}
  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search} />
    <div className="App-playlist">
      <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
      <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
      onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
    </div>
  </div>
</div>
    )
  }
}

export default App;
