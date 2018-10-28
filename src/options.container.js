import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import localStorage from 'local-storage';

import TwitchForm from './twitchForm.component';
import GithubRibbon from './github.component';
import ChannelList from './channelList.component';

import {
  setUsername,
  addChannel,
  removeChannel,
  toggleNotifications,
  startPollingChannels,
} from './notification.ducks';

const MainColumn = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px 10px;
`;

const Header = styled.h2`
  text-align: center;
`;

class Options extends React.Component {
  state = {
    newChannel: '',
    username: localStorage.get('username') || '',
  };

  componentDidMount() {
    const { channels, enabled, startPolling } = this.props;

    if (enabled) {
      startPolling(channels);
    }
  }

  changeField = field => e => {
    this.setState({ [field]: e.target.value });
  };

  saveUsername = debounce(username => {
    this.props.setUsername(username);
  }, 500);

  render() {
    const { channels, enabled, onChannelSubmit } = this.props;
    const { username, newChannel } = this.state;

    const newChannelLower = newChannel.toLowerCase();

    return (
      <Fragment>
        <GithubRibbon />
        <MainColumn>
          <Header>Nightbot song request notifications</Header>
          <TwitchForm
            username={username}
            newChannel={newChannel}
            onUsernameChange={e => {
              this.changeField('username')(e);
              this.saveUsername(e.target.value.toLowerCase());
            }}
            onNewChannel={this.changeField('newChannel')}
            onSubmit={e => {
              e.preventDefault();

              if (!newChannel) return;

              this.setState({ newChannel: '' }, () => {
                !channels.has(newChannelLower) &&
                  onChannelSubmit(newChannelLower);
              });
            }}
          />
          <ChannelList
            deleteChannel={this.props.deleteChannel}
            channels={channels}
            enabled={enabled}
            handleEnable={() => {
              if (!enabled && Notification.permission !== 'granted') {
                Notification.requestPermission().then(result => {
                  if (result === 'granted') {
                    this.props.toggleNotifications();
                  }
                });
              } else if (Notification.permission === 'granted') {
                this.props.toggleNotifications();
              } else {
                console.error('no permission given!!!');
              }
            }}
          />
        </MainColumn>
      </Fragment>
    );
  }
}

export default connect(
  ({ channels, enabled }) => ({ channels, enabled }),
  dispatch => ({
    deleteChannel: c => () => dispatch(removeChannel(c)),
    onChannelSubmit: channel => dispatch(addChannel(channel)),
    toggleNotifications: () => dispatch(toggleNotifications()),
    startPolling: channels => dispatch(startPollingChannels(channels)),
    setUsername: username => dispatch(setUsername(username)),
  }),
)(Options);
