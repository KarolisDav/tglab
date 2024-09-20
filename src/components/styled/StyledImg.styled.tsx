import styled from "styled-components";

export const StyledImg = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
  @media (max-width: 535px) {
    width: 100%;
    height: auto;
  }
`;
