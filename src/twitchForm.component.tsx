import React, { Fragment, SyntheticEvent } from 'react';
import styled from 'styled-components';

const AddButton = styled.button`
  margin-left: 10px;
`;

const ChannelInput = styled.input`
  min-width: 0;
  flex: 1;
`;

const ChannelRow = styled.div`
  display: flex;
`;

interface Props {
  readonly username: string;
  readonly newChannel: string;
  onSubmit(a: SyntheticEvent<HTMLFormElement>): void;
  onNewChannel(a: SyntheticEvent<HTMLInputElement>): void;
  onUsernameChange(a: SyntheticEvent<HTMLInputElement>): void;
}

const TwitchForm = ({
  onSubmit,
  username,
  newChannel,
  onNewChannel,
  onUsernameChange,
}: Props) => (
  <Fragment>
    <p>Get notified when your song request starts to play.</p>
    <form onSubmit={onSubmit}>
      <div>
        Enter your twitch username:
        <input
          id="username-field"
          value={username}
          onChange={onUsernameChange}
          type="text"
        />
      </div>

      <div>
        Add new channel whose song requests to get alerts:
        <ChannelRow>
          <ChannelInput
            name="newChannel"
            id="add-channel"
            type="text"
            value={newChannel}
            onChange={onNewChannel}
          />
          <AddButton className="button-outline" type="submit">
            add
          </AddButton>
        </ChannelRow>
      </div>
    </form>
  </Fragment>
);

export default TwitchForm;
