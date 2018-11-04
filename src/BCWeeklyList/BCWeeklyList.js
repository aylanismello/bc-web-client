import React, { Component } from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

class BCWeeklyList extends Component {
  state = {
    activeItemIdx: 0
  };

  render() {
    const { playlists } = this.props;
    return (
      <div className="BCWeeklyList">
        {playlists.map((playlist, idx) => (
          <BCWeeklyItem
            playlist={playlist}
            active={this.state.activeItemIdx === idx}
            key={idx}
            setAsActiveItem={() => {
              this.setState({ activeItemIdx: idx });
            }}
          />
        ))}
      </div>
    );
  }
}

export default BCWeeklyList;
