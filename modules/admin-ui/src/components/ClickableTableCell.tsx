import * as React from 'react';
import Link from 'mineral-ui/Link';
import styled from 'react-emotion';

const StyledLink = styled(Link)`
  cursor: pointer;
`;

export interface TableCellRenderProp {
  props: {
    children: React.ReactNode;
    columnKey: string;
    content: string;
    density: string;
    element: string;
    highContrast: boolean;
    rowIndex: number;
    striped: boolean;
  };
}

export default ({
  onClick = () => {},
  props,
}: {
  props: TableCellRenderProp;
  onClick: (cellProps: TableCellRenderProp) => any;
}) => {
  const onLinkClick = () => onClick(props);
  return (
    <td>
      <StyledLink onClick={onLinkClick}>{props.props.children}</StyledLink>
    </td>
  );
};
