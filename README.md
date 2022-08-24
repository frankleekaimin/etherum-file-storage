# etherum-file-storage
Decentralised file storage

An basic web3 application + smart contract I created for an assignment. The purpose of this contract is to allow a server to prove to a client that a file is being stored on the blockchain.
For demo purposes, the file is stored as a string. The smart contract will periodically (every 5 blocks) pay out 2 ETH to the server if the server uploads the customer's file to the smart contract for verification. The smart contract verifies the file by checking its hash and file length (to prevent the server from cheating with a file that happens to have the same hash but smaller size).

To run this, do the following steps:

1) Deploy the smart contract located at "../simple-storage/contracts/Storage.sol". You might have to add in the details of your blockchain in ../simple-storage/truffle-config.js (I am running Ganache on my local host, port 7545) We will assume that the file storage server is the one who deploys this contract.
2) Edit the contract address at ../webserver/blockchain/storing.js to reference the smart contract you deployed.
3) Run the web server located at ../web-server with the command "npm run dev".
4) A customer can upload his files and add Etherum to the smart contract at "<web server>/home". (For my computer, I ran my webserver on port 3000, so the webpage for the customer to access is "localhost:3000/home".
5) The server admin can upload the proof of storing his files on "<web server>/admin".

The smart contract is located at "../simple-storage/contracts/Storage.sol" and "../webserver/blockchain/contracts".
The webpage for the customer is located at "../webserver/pages/home".
The webpage for the server is located at "../webserver/pages/admin".
