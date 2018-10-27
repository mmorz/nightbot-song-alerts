import React from 'react';
import styled from 'styled-components';

const AddButton = styled.button`
  margin-left: 10px;
`;

const ChannelInput = styled.input`
  && {
    width: auto;
  }

  flex: 1;
`;

const ChannelRow = styled.div`
  width: 100%;
  display: flex;
`;

const TwitchForm = ({
  onSubmit,
  username,
  newChannel,
  onNewChannel,
  onUsernameChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      Enter your twitch username:
      <input value={username} onChange={onUsernameChange} type="text" />
    </div>

    <div>
      Add new channel whose song requests to get alerts:
      <ChannelRow>
        <ChannelInput
          name="newChannel"
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
);

export default TwitchForm;
