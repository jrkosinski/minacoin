
class RealHttpApi {
    async getWalletInfo() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3002/public-key').then((data, err) => {
                if (data) {
                    data = data.json();
                }
                resolve(data);
            });
        });
    }
}

export default RealHttpApi;