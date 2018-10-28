import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
  display: inline-block;
`;

const GithubRibbon = ({ className }) => (
  <Container>
    <a className={className} href="https://github.com/you">
      <OffsetImg
        src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" // eslint-disable-line
        alt="Fork me on GitHub"
      />
    </a>
  </Container>
);

const OffsetImg = styled.img`
  transform: translate(10px, -10px);
`;

export default GithubRibbon;
