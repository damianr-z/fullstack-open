import styled from 'styled-components';

const Home = () => {

  const StyledHome = styled.div`
    padding: 2em;
    background: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  `;

  return (
    <StyledHome>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa aliquam
      ipsum est aliquid! Reprehenderit, quia iste fugiat commodi, quod officia,
      non neque asperiores provident excepturi veritatis ex aliquam rerum eaque.
    </StyledHome>
  );
};

export default Home;
