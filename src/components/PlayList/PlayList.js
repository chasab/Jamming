import React, { Component } from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList.js';


class PlayList extends Component {
constructor(props) {
super(props);

this.handleNameChange = this.handleNameChange.bind(this);
}

handleNameChange(event) {
  this.props.onNameChange(event.target.value);
}


render() {
  return(
<div className="Playlist">
  <input defaultValue={'New PlayList'} onChange={this.handleNameChange}/>
  <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
  <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
</div>
)
}
}
export default PlayList;
