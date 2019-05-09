import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import Grid from '@app/components/Grid';
import CircleInitials from '@app/components/CircleInitials';
import { theme } from '@utils/color';
import { getInitials } from '@app/utils/utils';
import { Category } from '@app/types/types';

interface Props {
  categories: Category[];
  bidTax: string | null;
}

const Container = styled.div`
  margin-top: 2em;
  padding: 0;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;
  div:first-child {
    font-size: 1.25em;
  };
`;

const CardContainer = styled.div`
  border: 1px solid ${theme.components.border.hex};
  border-radius: .3em;
  text-align: center;
  padding: 1.5em;
  &:hover {
    background-color: ${theme.interactions.hover.lighten(.05)};
    cursor: pointer;
  }
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: .3em;
`;

const CardTitle = styled.div`
  font-size: 1.3em;
`;

const CardInfo = styled.div`
  font-size: .8em;
  color: ${theme.text.light.hex};
`;

const MiniHR = styled.div`
  width: 10%;
  margin: 0 auto;
`;

const generateRows = (category: Category) => {
  return (
    <CardContainer key={category.url}>
      <CircleWrapper>
        <CircleInitials
          color={`#${category.color}`}
          initials={getInitials(category.name)}
          size={2}
        />
      </CircleWrapper>
      <CardTitle>{category.name}</CardTitle>
      <MiniHR><HorizontalRule/></MiniHR>
      <CardInfo>{Math.floor(Math.random() * 10)} Subcategories</CardInfo>
    </CardContainer>
  );
};

const generateTable = (categories: Props['categories']) => (
  <Grid
    cells={categories.map(generateRows)}
    containerId="category-container"
    maxColumns={5}
    alignment="left"
    margin="auto"
  />
);

const Categories = (props: Props) => {
  return (
    <Container id="category-container">
      <Header>
        <div>Categories</div>
      </Header>
      {generateTable(props.categories)}
    </Container>
  );
};

export default Categories;
