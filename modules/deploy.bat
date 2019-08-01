

cp -r ./minacoin-common ../genesis-server/node_modules
cp -r ./minacoin-core ../genesis-server/node_modules
sudo rm -r -d ../genesis-server/node_modules/minacoin-core/node_modules
sudo rm -r -d ../genesis-server/node_modules/minacoin-core/test
cp -r ./p2p-client ../genesis-server/node_modules

cp -r ./minacoin-common ../web-client/node_modules/
cp -r ./minacoin-core ../web-client/node_modules/
sudo rm -r -d ../web-client/node_modules/minacoin-core/node_modules
sudo rm -r -d ../web-client/node_modules/minacoin-core/test
cp -r ./minacoin-client ../web-client/node_modules/
cp -r ./p2p-client ../web-client/node_modules



