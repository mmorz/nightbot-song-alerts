import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
  display: inline-block;
`;

const GithubRibbon = () => (
  <Container>
    <a href="https://github.com/mmorz/nightbot-song-alerts">
      <OffsetImg
        src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" // tslint:disable-line
        alt="Fork me on GitHub"
      />
    </a>
  </Container>
);

const OffsetImg = styled.img`
  transform: translate(10px, -10px);
`;

export default GithubRibbon;
