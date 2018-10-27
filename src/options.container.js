import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import localStorage from 'local-storage';

import TwitchForm from './twitchForm.component';

import {
  setUsername,
  addChannel,
  removeChannel,
  toggleNotifications,
  startPollingChannels,
} from './notification.ducks';

const EnableColumn = styled.div`
  flex: 1;
`;

const EnableButton = styled.button`
  margin: 0 auto;
  display: block;
`;

const ChannelList = styled.ul`
  flex: 1;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainColumn = styled.div`
  width: 800px;
  margin: 50px auto;
`;

const Header = styled.h2`
  text-align: center;
`;

const Channel = styled.span`
  margin-right: auto;
`;

const DeleteButton = styled.button`
  flex: 0;
  margin-bottom: 0;
`;

const ListRow = styled.li`
  align-items: center;
  display: flex;
`;

class Options extends React.Component {
  state = {
    newChannel: '',
    username: localStorage.get('username') || '',
  };

  componentDidMount() {
    this.props.startPolling(this.props.channels);
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
        <Grid>
          <ChannelList>
            {channels.map((c, i) => (
              <ListRow key={c + i}>
                <Channel>{c}</Channel>
                <DeleteButton
                  className="button-outline"
                  onClick={this.props.deleteChannel(c)}
                >
                  delete
                </DeleteButton>
              </ListRow>
            ))}
          </ChannelList>
          <EnableColumn>
            <EnableButton
              onClick={() => {
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
            >
              {enabled ? 'disable' : 'enable'}
            </EnableButton>
          </EnableColumn>
        </Grid>
      </MainColumn>
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
