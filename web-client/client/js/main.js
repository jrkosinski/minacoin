
function getWallet() {
    api.getWalletInfo((wallet) => {
        if (wallet) {
            $("#addressText").text(wallet.address); 
            $("#balanceText").text(wallet.balance); 
            $("#chainSizeText").text(wallet.chainSize); 

            const blockHashes = wallet.blockHashes; 
            $("#blockListDiv").empty(); 

            for (let n=0; n<blockHashes.length; n++) {
                $("#blockListDiv").append("<div class='tiny-gold-text'>" + blockHashes[n] + "</div>"); 
            }
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
    setInterval(() => {getWallet();}, 10000);
}


$(document).ready(function () {
    startup();
}); 