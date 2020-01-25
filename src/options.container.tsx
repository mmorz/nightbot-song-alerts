import debounce from "lodash/debounce";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import ChannelList from "./channelList.component";
import GithubRibbon from "./github.component";
import { getStorageJson } from "./localStorage";
import { actions, Store } from "./notification.ducks";
import TwitchForm from "./twitchForm.component";

const {
  setUsername,
  addChannel,
  removeChannel,
  toggleNotifications,
  startPollingChannels
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
  readonly channels: ReadonlyArray<string>;
  readonly enabled: boolean;
  readonly deleteChannel: (a: string) => (b: unknown) => void;
  startPolling(a: ReadonlyArray<string>): void;
  setUsername(a: string): void;
  onChannelSubmit(a: string): void;
  toggleNotifications(): void;
}

interface State {
  readonly username: string;
  readonly newChannel: string;
}

class Options extends React.Component<Props, State> {
  state = {
    newChannel: "",
    username: (getStorageJson("username") as string) || ""
  };

  saveUsername = debounce((username: string) => {
    this.props.setUsername(username);
  }, 500);

  componentDidMount() {
    const { channels, enabled, startPolling } = this.props;

    if (enabled) {
      startPolling(channels);
    }
  }

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
              this.setState({ username: e.currentTarget.value });
              this.saveUsername(e.currentTarget.value.toLowerCase());
            }}
            onNewChannel={e =>
              this.setState({ newChannel: e.currentTarget.value })
            }
            onSubmit={e => {
              e.preventDefault();

              if (!newChannel) {
                return;
              }

              this.setState(
                { newChannel: "" },
                () =>
                  !channels.some(c => c === newChannelLower) &&
                  onChannelSubmit(newChannelLower)
              );
            }}
          />
          <ChannelList
            deleteChannel={this.props.deleteChannel}
            channels={channels}
            enabled={enabled}
            handleEnable={() => {
              if (!enabled && Notification.permission !== "granted") {
                Notification.requestPermission().then(result => {
                  if (result === "granted") {
                    this.props.toggleNotifications();
                  }
                });
              } else if (Notification.permission === "granted") {
                this.props.toggleNotifications();
              } else {
                console.error("no permission given!!!");
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
    startPolling: (channels: ReadonlyArray<string>) =>
      dispatch(startPollingChannels(channels)),
    setUsername: (username: string) => dispatch(setUsername(username))
  })
)(Options);
