import styled from 'styled-components';
import { theme } from '../utils/color';

const Card = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  background-color: ${theme.background};
`;

export default Card;
