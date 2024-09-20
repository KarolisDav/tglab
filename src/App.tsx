import ArticleList from "./components/ArticleList";
import {Container} from "./components/styled/Container.styled";
import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #b6a6ca;
  }
`;

const App: React.FC = () => {
  return (
    <Container>
      <GlobalStyle />
      <ArticleList />
    </Container>
  );
};

export default App;
