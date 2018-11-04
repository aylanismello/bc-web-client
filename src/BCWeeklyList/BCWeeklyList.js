import React, { Component } from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

class BCWeeklyList extends Component {
  render() {
    const { playlists } = this.props;
    return (
      <div className="BCWeeklyList">
        {playlists.map((playlist, idx) => (
          <BCWeeklyItem
            playlist={playlist}
            active={this.props.activePlaylistIdx === idx}
            key={idx}
            setAsActiveItem={() => {
              this.props.updateActivePlaylist(idx);
            }}
          />
        ))}
      </div>
    );
  }
}

export default BCWeeklyList;
