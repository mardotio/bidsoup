import * as React from 'react';
import styled from 'styled-components';
import Grid from '@app/components/Grid';
import { Color, theme } from '@utils/color';
import { Category } from '@app/types/types';

interface Props {
  categories: Category[];
  bidTax: string | null;
}

const Container = styled.div`
  margin-top: 1em;
  width: 100%;
  padding: 1em 0;
`;

const SectionTitle = styled.div`
  margin-top: 1em;
  color: ${theme.primary.hex};
  &:after {
    content: "";
    width: 3em;
    height: 1px;
    background-color: ${theme.components.darkBorder.hex};
    display: block;
    margin-top: .2em;
  }
`;

const CardContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto auto;
  border-radius: .3em;
  padding: 1.5em;
  background-color: ${Color.shade(0).hex};
  cursor: pointer;
`;

const CategoryTitle = styled.h3`
  border-radius: .3em;
  color: ${Color.shade(0).hex};
  display: inline;
  font-size: 1em;
  font-weight: normal;
  margin: 0;
  justify-self: start;
  padding: .3em;
`;

const CardInfo = styled.div`
  font-size: .8em;
  color: ${theme.text.light.hex};
`;

const MarkupContainer = styled.div`
  grid-column: 2;
  grid-row: 1 / span 3;
  div:first-child {
    text-align: center;
    padding: 1em;
  }
  div:last-child {
    color: ${theme.primary.hex};
    text-align: center;
  }
`;

const generateRows = (category: Category) => {
  return (
    <CardContainer key={category.url}>
      <CategoryTitle
        style={{
          backgroundColor: new Color(category.color).toRgba(.2),
          color: `#${category.color}`
        }}
      >
        {category.name}
      </CategoryTitle>
      <MarkupContainer>
        <div>{category.markupPercent ? category.markupPercent : 0}%</div>
        <div>Markup</div>
      </MarkupContainer>
      <CardInfo>{Math.floor(Math.random() * 10)} Subcategories</CardInfo>
      <CardInfo>{Math.floor(Math.random() * 10)} Units</CardInfo>
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

const Categories = (props: Props) => (
  <>
    <SectionTitle>Categories</SectionTitle>
    <Container id="category-container">
      {generateTable(props.categories)}
    </Container>
  </>
);

export default Categories;
