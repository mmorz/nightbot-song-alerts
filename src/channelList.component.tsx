import React from 'react';
import styled from 'styled-components';
import { Set } from 'immutable';

const Channel = styled.span`
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteButton = styled.button`
  flex: 0;
  margin-bottom: 0;
`;

const ListRow = styled.li`
  align-items: center;
  display: flex;
  margin: 0 0;
  padding: 7px 0;

  border-bottom: 1px solid #d1d1d1;

  &:last-child {
    border-bottom: 0;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 600px) {
    display: block;
  }
`;

const EnableColumn = styled.div`
  flex: 1;
`;

const EnableButton = styled.button`
  margin: 0 auto;
  display: block;

  @media (max-width: 600px) {
    margin: 0 0;
  }
`;

const ChannelContainer = styled.ul`
  overflow: hidden;
  flex: 1;
`;

interface Props {
  channels: Set<any>;
  enabled: boolean;
  handleEnable: (a: any) => void;
  deleteChannel: (a: string) => (b: any) => void;
}

const ChannelList = ({
  channels,
  enabled,
  handleEnable,
  deleteChannel,
}: Props) => (
  <Grid>
    <ChannelContainer>
      {channels.map(c => (
        <ListRow key={c}>
          <Channel>{c}</Channel>
          <DeleteButton className="button-clear" onClick={deleteChannel(c)}>
            delete
          </DeleteButton>
        </ListRow>
      ))}
    </ChannelContainer>
    <EnableColumn>
      <EnableButton onClick={handleEnable}>
        {enabled ? 'disable' : 'enable'}
      </EnableButton>
    </EnableColumn>
  </Grid>
);

export default ChannelList;
