import styled from 'styled-components';
import { theme } from '../utils/color';

const HorizontalRule = styled.div`
  height: 1px;
  background-color: ${theme.components.border.hex};
  margin: 10px 0;
`;

export default HorizontalRule;
