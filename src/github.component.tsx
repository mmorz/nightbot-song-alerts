import React from "react";
import styled from "styled-components";

import githubLogo from "./githublogo.png";

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
  display: inline-block;
`;

const GithubLogo = styled.img`
  width: 50px;
  opacity: 25%;
  margin: 11px;
`;

const GithubRibbon = () => (
  <Container>
    <a href="https://github.com/mmorz/nightbot-song-alerts">
      <GithubLogo
        src={githubLogo}
        alt="Fork me on GitHub"
      />
    </a>
  </Container>
);

export default GithubRibbon;
