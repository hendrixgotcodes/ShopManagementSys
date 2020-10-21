

const listItemExcel = document.querySelector(".dd_listItem--excel");



listItemExcel.addEventListener("click", openFileExplorer)


function openFileExplorer(){
    ipcRenderer.send("openFileExplorer")

}

ipcRenderer.on("serveFilePath",(e, path)=>{
    renderXLFile(path);
})