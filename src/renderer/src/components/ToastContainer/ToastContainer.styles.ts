import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  padding: 10px;
  overflow: hidden;
  z-index: 2;
  /* Medium ≥768px */
  @media (min-width: 768px) {
    padding: 30px;
  }
`;

export default Wrapper;
