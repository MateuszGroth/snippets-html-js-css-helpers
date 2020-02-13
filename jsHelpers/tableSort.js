const _getCellValue = (tr, idx) =>
  tr.children[idx].innerText || tr.children[idx].textContent;
const _comparer = (idx, asc) => (a, b) =>
  ((v1, v2) =>
    v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
      ? v1 - v2
      : v1.toString().localeCompare(v2))(
    _getCellValue(asc ? a : b, idx),
    _getCellValue(asc ? b : a, idx)
  );
const _sortableColumnClick = el => {
  let th = el.currentTarget;
  $(th)
    .closest("table")
    .css("cursor", "progress");
  const table = th.closest("table").querySelector("tbody");
  Array.from(table.querySelectorAll("tr:nth-child(n)"))
    .sort(
      _comparer(
        Array.from(th.parentNode.children).indexOf(th),
        (this.asc = !this.asc)
      )
    )
    .forEach(tr => table.appendChild(tr));
};

// simply attach _sortableColumnClick to header cell of the column you want to sort by
