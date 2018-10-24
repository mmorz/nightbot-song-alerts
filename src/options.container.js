import React from "react";
import styled from "styled-components";

const MainColumn = styled.div`
  width: 800px;
  margin: 50px auto;
`;

const Header = styled.h2`
  text-align: center;
`;

class Options extends React.Component {
  state = {
    channels: [],
    username: "aa",
    newChannel: ""
  };

  addChannel = () => {
    const { newChannel, channels } = this.state;

    if (!newChannel) return;

    console.log("channels", channels);

    this.setState({
      channels: channels.add(newChannel.toLowerCase()),
      newChannel: ""
    });
  };

  delete = channel => () => {
    this.setState(({ channels }) => {
      channels.delete(channel);
      return { channels };
    });
  };

  render() {
    const { channels, username, newChannel } = this.state;

    return (
      <MainColumn>
        <Header>Nightbot song request notifications</Header>
        <section>
          Enter your twitch username:
          <input
            value={username}
            onChange={e =>
              this.setState({
                username: e.target.value
              })
            }
          />
        </section>

        <section>
          Add new channel whose song requests to get alerts:
          <input
            value={newChannel}
            onChange={e =>
              this.setState({
                newChannel: e.target.value
              })
            }
          />
          <button onClick={this.addChannel}>add</button>
        </section>

        <button onClick={this.saveSettings}>save & close</button>

        <ul>
          {Array.from(channels).map((c, i) => (
            <li key={c + i}>
              <button onClick={this.delete(c)}>delete</button>
              {c}
            </li>
          ))}
        </ul>
      </MainColumn>
    );
  }
}

export default Options;
