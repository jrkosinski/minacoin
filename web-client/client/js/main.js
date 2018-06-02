
function showMainScreen() {
    $("#sendButton").click(() => {
        let recip = $("#").val();
        let amountText = $("#").val(); 

        //validate 
        let amount = 0; 
        amountText = amountText.trim(); 
        try{
            amount = parseFloat(amountText); 
        }
        catch{
            alert('amount must be a number'); 
            return;
        }
        if (amount <= 0)  {
            alert('amount must be a positive number'); 
            return; 
        }
        
        api.sendCoins(recip, amount, () => {
            
        }); 
    }); 
}


$(document).ready(function () {
    startup();
}); 