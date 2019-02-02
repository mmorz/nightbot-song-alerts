import React, { Fragment, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import localStorage from 'local-storage';

import TwitchForm from './twitchForm.component';
import GithubRibbon from './github.component';
import ChannelList from './channelList.component';

import { actions, Store } from './notification.ducks';

const {
  setUsername,
  addChannel,
  removeChannel,
  toggleNotifications,
  startPollingChannels,
} = actions;

const MainColumn = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px 10px;
`;

const Header = styled.h2`
  text-align: center;
`;

interface Props {
  channels: ReadonlyArray<string>;
  enabled: boolean;
  startPolling(a: ReadonlyArray<string>): void;
  setUsername(a: string): void;
  onChannelSubmit(a: string): void;
  deleteChannel: (a: string) => (b: any) => void;
  toggleNotifications(): void;
}

class Options extends React.Component<Props> {
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

  changeField = (field: 'username' | 'newChannel') => (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ [field]: e.currentTarget.value });
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
              this.saveUsername(e.currentTarget.value.toLowerCase());
            }}
            onNewChannel={this.changeField('newChannel')}
            onSubmit={e => {
              e.preventDefault();

              if (!newChannel) return;

              this.setState({ newChannel: '' }, () => {
                !channels.some(c => c === newChannelLower) &&
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
  ({ channels, enabled }: Store) => ({ channels, enabled }),
  dispatch => ({
    deleteChannel: (c: string) => () => dispatch(removeChannel(c)),
    onChannelSubmit: (channel: string) => dispatch(addChannel(channel)),
    toggleNotifications: () => dispatch(toggleNotifications()),
    startPolling: (channels: string[]) => dispatch(startPollingChannels(channels)),
    setUsername: (username: string) => dispatch(setUsername(username)),
  }),
)(Options);
