
function getWallet() {
    api.getWalletInfo((data) => {
        if (data) {
            $("#addressText").text(data.address); 
            $("#balanceText").text(data.balance); 
        }
    }); 
}

function showMainScreen() {
    $("#sendButton").click(() => {
        let recip = $("#recipientInputText").val();
        let amountText = $("#amountInputText").val(); 

        //validate 
        let amount = 0; 
        amountText = amountText.trim(); 
        
        amount = parseFloat(amountText); 
        
        if (!amount || isNaN(amount)) {
            alert('amount must be a number'); 
            return;
        }
        if (amount <= 0)  {
            alert('amount must be a positive number'); 
            return; 
        }
        
        api.sendCoins(recip, amount, () => {
            alert('sent; waiting for confirmation'); 
        }); 
    }); 

    getWallet();
    //setInterval(() => {getWalletInfo();}, 10000);
}


$(document).ready(function () {
    startup();
}); 