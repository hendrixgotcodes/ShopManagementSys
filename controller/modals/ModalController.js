const bootbox = require('bootbox');

class Modal {

    //Handles Form for adding new item in Inventory
    static openInventoryForm();

    //Confirmation DialogBox
    static openConfirmationBox(itemName, itemCount){

        bootbox.confirm({
            size: "lg",
            message: `You Are About To Delete ${itemName} Which Has ${itemCount} Items In Inventory. Are You Sure ?`,
            buttons: {
                cancel: {
                    label: "Review Selection",
                    className: "modal_btn--green",
                    callback: ()=> false
                },
                confirm: {
                    label: "Yes Delete",
                    className: "modal_btn--red",
                    callback: ()=>{
                        bootbox.prompt({
                            size: "sm",
                            message: "Enter Password",
                            buttons: {
                                confirm: {
                                    label: "ok",
                                    className: "modal_btn--red",
                                    callback: (result)=> result;
                                }
                            }
                        })
                    } 
                }
            }

        })        


        // const newDialog = 
        // `
        //     <div class="dialogContainer fullwidth aDialog" role="container">
        //         <div class="header" role="header">
        //             <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
        //         </div>

        //         <div class="dialogHeader fullwidth" role="body">
        //             Are You Sure You Want To Delete ${itemName} from Inventory?
        //             It has a quantity of (${itemCount}).

        //         </div>

        //         <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
        //             <div class="dialogDelete">
        //                 Yes, Delete
        //             </div>
        //             <div class="dialogRevert">
        //                 Review Selection
        //             </div>
        //         </div>

        //     </div>
        // `

        // const confirmationBox = document.createElement('div');
        // confirmationBox.className = "settingsModal";
        // confirmationBox.setAttribute("aria-placeholder", "Confirm Box");



    }
    
}

module.exports = Modal;