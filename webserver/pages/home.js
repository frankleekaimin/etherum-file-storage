import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import storageContract from '../blockchain/storing'
import 'bulma/css/bulma.css'
import styles from '../styles/Storage.module.css'

const Storage = () => {
    const [error,setError] = useState('')
    const [successMsg,setsuccessMsg] = useState('')
    const [myinfo, setMyInfo] = useState('')
    const [depositAmt, setDepositAmt] = useState('')
    const [uploadFile, setUploadFile] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(0)

    useEffect(() => {
        if (vmContract && address) setMyInfoHandler()
    }, [vmContract, address])

    const setMyInfoHandler = async() => {
        const myinfo = await vmContract.methods.customers(address).call()
        setMyInfo(myinfo)
    }

    const updateFile = event => {
        setUploadFile(event.target.value)
    }

    const fs = require('fs');

    const uploadFileHandler = async () => {
        try {
            await vmContract.methods.uploadfile(uploadFile).send({
                from: address})
            setsuccessMsg('File uploaded')
            
            if (vmContract && address) setMyInfoHandler()
        } catch(err) {
            setError(err.message)
        }
    }

    const updateDepositAmt = event => {
        setDepositAmt(event.target.value)
    }

    const depositHandler = async () => {
        try {
            await vmContract.methods.deposit().send({
                from: address,
                value: web3.utils.toWei(depositAmt,'ether')
            })
            setsuccessMsg(`${depositAmt} ETH deposited!`)
            
            if (vmContract && address) setMyInfoHandler()
        } catch(err) {
            setError(err.message)
        }
    }

    const endContractHandler = async () => {
        try {
            await vmContract.methods.endcontract().send({
                from: address})
            setsuccessMsg('ETH has been refunded.')
            
            if (vmContract && address) setMyInfoHandler()
        } catch(err) {
            setError(err.message)
        }
    }

    const connectWallerHandler = async () => {
        /* check if MetaMask if available */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* request wallet connect */
                await window.ethereum.request({ method: "eth_requestAccounts"})
                /* set web3 instance */
                web3 = new Web3(window.ethereum)
                setWeb3(web3)
                /* get list of accounts*/
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                /* create local contract copy*/
                const vm = storageContract(web3)
                setVmContract(vm)
            } catch(err) {
                setError(err.message)
            }
            
            
        } else{
            //meta mask not installed
            console.log("Please install Metamask")
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Storage Server Website App</title>
                <meta name="description" content="A blockchain app"/>
            </Head>
            <navbar className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Blockchain App</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={connectWallerHandler} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </navbar>
            <section>
                <div className="container">
                    <h2>Balance credits: {myinfo.balance} Wei</h2>
                    <h2>File hash (if uploaded): {myinfo.filehash}</h2>
                    <h2>File size: {myinfo.filesize} Bytes</h2>
                </div>
            </section>

            <section className='mt-5'>
                <div className="container">
                    <div className='field'>
                        <label className='label'>Upload file</label>
                        <div className='control'>
                            <input onChange={updateFile} className='input' type='type' placeholder="String..." />
                        </div>
                        <button 
                        onClick={uploadFileHandler} 
                        className="button is-primary mt-2"
                        >Upload file</button>
                    </div>
                </div>
            </section>

            <section className='mt-5'>
                <div className="container">
                    <div className='field'>
                        <label className='label'>Deposit ETH</label>
                        <div className='control'>
                            <input onChange={updateDepositAmt} className='input' type='type' placeholder="Enter amount..." />
                        </div>
                        <button 
                        onClick={depositHandler} 
                        className="button is-primary mt-2"
                        >Deposit ETH</button>
                    </div>
                </div>
            </section>

            <section className='mt-5'>
                <div className="container">
                    <div className='field'>
                        <label className='label'>End contract: (Remaining balance will be refunded)</label>
                        <button 
                        onClick={endContractHandler} 
                        className="button is-danger mt-2"
                        >End Contract</button>
                    </div>
                </div>
            </section>
            <section>
                <div className='container has-text-danger mt-5'>
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className='container has-text-success mt-5'>
                    <p>{successMsg}</p>
                </div>
            </section>
        </div>
    )
}

export default Storage