import React from "react";

const Table = () => {
  const [sortedBy, setSortedBy] = useState({
    label: "Id",
    order: "ASC"
  });

  const tableHeader = [
    { label: "Id", sortable: true },
    { label: "Comment", sortable: true },
    { label: "Name", sortable: true },
    { label: "Value", sortable: false },
    { label: "Type", sortable: true }
  ];

  const tableRows = [
    ["1", "pierwszy", "test", "1", "8typ1"],
    ["2", "drugi", "atest", "18", "1typ1"],
    ["3", "trzeci", "btest", "2", "5typ1"],
    ["4", "czwarty", "ztest", "8", "2typ1"]
  ];

  const _onSortableHeaderClick = label => {
    setSortedBy(prevState => {
      if (label === prevState.label) {
        return {
          ...prevState,
          order: prevState.order === "ASC" ? "DESC" : "ASC"
        };
      }

      return {
        label,
        order: "ASC"
      };
    });
  };

  const _getSortedByColIndex = () => {
    let i = 0;

    while (i < tableHeader.length) {
      if (tableHeader[i].label === sortedBy.label) {
        return i;
      }

      i++;
    }

    return 0;
  };

  return (
    <Table size="sm" striped bordered>
      <TableHead
        sortedBy={sortedBy}
        headerColumns={tableHeader}
        onHeaderCellClick={_onSortableHeaderClick}
      />
      <TableBody
        rows={tableRows}
        sortedCol={_getSortedByColIndex()}
        sortOrder={sortedBy.order}
      />
    </Table>
  );
};

const TableHead = props => {
  const _getSortedClassName = label =>
    label !== props.sortedBy.label
      ? ""
      : `node-ct__thead--${props.sortedBy.order.toLowerCase()}`;

  return (
    <thead>
      <tr>
        {props.headerColumns.map((cellData, i) =>
          !!cellData.sortable ? (
            <th
              key={cellData.label + i}
              onClick={props.onHeaderCellClick.bind(null, cellData.label)}
              className={`node-ct__thead node-ct__thead--sortable ${_getSortedClassName(
                cellData.label
              )}`}
            >
              {cellData.label}
            </th>
          ) : (
            <th key={cellData.label + i} className="node-ct__thead">
              {cellData.label}
            </th>
          )
        )}
      </tr>
    </thead>
  );
};

const TableBody = props => {
  const _comparer = i => (a, b) =>
    ((v1, v2) =>
      v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
        ? v1 - v2
        : v1.toString().localeCompare(v2))(
      ...(props.sortOrder === "ASC" ? [a[i], b[i]] : [b[i], a[i]])
    );
  const sortedRows = props.rows.sort(_comparer(props.sortedCol));

  return (
    <tbody>
      {sortedRows.map((columns, id) => (
        <tr key={"row" + id}>
          {columns.map((column, colId) => (
            <td key={"col" + colId}>{column}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
