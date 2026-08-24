import styled from 'styled-components';

const Footer = () => {
  const Styledfooter = styled.footer`
    background: chocolate;
    padding-block: 1em;
    margin-top: auto;
    text-align: center;
    width: 100%;
  `;


  return (
    <Styledfooter>
      Note app, Department of Computer Science, University of Helsinki 2025
    </Styledfooter>
  );
};

export default Footer;
