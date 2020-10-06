/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

function sortTableByColumnNumber(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        let aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        let bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        aColText = parseFloat(aColText);
        bColText = parseFloat(bColText);

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}


let clicked = false;

document.querySelectorAll(".contentTable .th_sort ").forEach(headerCell => {
    headerCell.querySelector('.items_pad').addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        // console.log('tableElement:' + tableElement);

        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        console.log('headerIndex:' + headerIndex);

        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        // console.log('currentIsAscending:' + currentIsAscending);


        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);

        //Changing Image
        if (clicked === false) {
            const sortImg = headerCell.querySelector('.items_pad');
            sortImg.setAttribute('src', '../Icons/table/header/sortsort.png')
            clicked = true;
        } else {
            const sortImg = headerCell.querySelector('.items_pad');
            sortImg.setAttribute('src', '../Icons/table/header/sort.png')
            clicked = false;
        }
    });
});

let clickedNum = false;

document.querySelectorAll(".contentTable .th_sortNumber ").forEach(headerCell => {
    headerCell.querySelector('.items_pad').addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        // console.log('tableElement:' + tableElement);

        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        console.log('headerIndex:' + headerIndex);

        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        // console.log('currentIsAscending:' + currentIsAscending);


        sortTableByColumnNumber(tableElement, headerIndex, !currentIsAscending);
        
        //Changing Image
        if (clickedNum === false) {
            const sortImg = headerCell.querySelector('.items_pad');
            sortImg.setAttribute('src', '../Icons/table/header/sortsort.png')
            clickedNum = true;
        } else {
            const sortImg = headerCell.querySelector('.items_pad');
            sortImg.setAttribute('src', '../Icons/table/header/sort.png')
            clickedNum = false;
        }
    });
});