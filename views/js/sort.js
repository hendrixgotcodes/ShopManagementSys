const domTable = document.querySelector('.contentTable');

/**
 * @param {HTMLTableElement} table
 * @param {number} column
 * @param {boolen} asc
 */


function sortTable(table, column, asc = true){

    const dirModifier = asc = true ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    
    //Sort Each Row
    const sortedRows = rows.sort((a, b)=>{
        const aColTex = a.querySelectorAll(`td:nth-child(${column+1})`).textContent.trim();
        const bColTex = b.querySelectorAll(`td:nth-child(${column+1})`).textContent.trim();

        return aColTex > bColTex ? (1* dirModifier) : (-1 * dirModifier);
        
    })

}

sortTable(domTable, 1, true);