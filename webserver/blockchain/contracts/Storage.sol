// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Storage {
    struct Customer {
        uint balance;
        bytes32 filehash; 
        uint filesize;
        uint last_reward;
    }

    mapping(address => Customer) public customers;   // Customer information
    address private server;

    // Constructor when setting up contract
    constructor() {
        server = payable(msg.sender);
    }

    // Events
    event Deposit(address customer, uint balance);
    event Provided_proof(address customer, uint balance);
    event File_uploaded(address customer, bytes32 filehash, uint filesize);
    event Ended_contract(address customer);

    // Helper functions

    // For server to execute and receive payment
    function provideproof(address customer, string memory file) public returns(bool) {
        require(msg.sender == server, "This function can only be used by the server");
        require(verifyproof(customer, file), "Incorrect proof provided");
        uint interval = 5;
        require(block.number > customers[msg.sender].last_reward + interval, "Not enough time has passed since last payout");
        customers[msg.sender].last_reward = block.number/interval*interval;
        customers[customer].balance -= 2 ether;
        payable(server).transfer(2 ether);
        emit Provided_proof(customer, customers[msg.sender].balance);
        return true;
    }

    function verifyproof(address customer, string memory file) public view returns (bool){ 
        if (customers[customer].filehash == keccak256(abi.encode(file)) && customers[customer].filesize == bytes(file).length) {
            return true;
        }
        return false;
    }

    // Client functions
    function uploadfile(string memory file) public {
        // Store hash of filehash in blockchain
        // Actual function will not require filesize parameter
        customers[msg.sender].filehash = keccak256(abi.encode(file));
        customers[msg.sender].filesize = bytes(file).length;
        customers[msg.sender].last_reward = 0;
        emit File_uploaded(msg.sender, customers[msg.sender].filehash, customers[msg.sender].filesize);
    }

    function deposit() public payable {
        customers[msg.sender].balance += msg.value;     // adjust the customer's balance
        emit Deposit(msg.sender, customers[msg.sender].balance);
    }

    function endcontract() public payable {
        payable(msg.sender).transfer(customers[msg.sender].balance);
        delete customers[msg.sender];
        emit Ended_contract(msg.sender);
    }
}