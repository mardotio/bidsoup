import React from 'react';
import Row from './Row';

const Overview = props => {
  let {category, total} = props.value;
  let overviewData = [
    {
      isHeader: true,
      data: {
        description: category
      }
    },{
      data: {
        description: 'total',
        total: total
      }
    }
  ];

  let overview = overviewData.map((row, i) => (
    <Row
      background={props.background}
      key={i}
      keys={props.keys}
      row={row.data}
      isHeader={row.isHeader}
    />
  ));

  return overview;
};

export default Overview;