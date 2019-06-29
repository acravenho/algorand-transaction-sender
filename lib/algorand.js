const algosdk = require('algosdk')
const request = require('./request')

const atoken = process.env.ALGOD_TOKEN
const aserver = process.env.ALGOD_SERVER
const aport = process.env.ALGOD_PORT 


//instantiate the algod wrapper
let algodclient = new algosdk.Algod(atoken, aserver, aport);

async function getLatestBlock () {
  let results = new Promise(async(resolve, reject) => {
    let lastround = await algodclient.status().lastRound
    let block = await algodclient.block(lastround)
    resolve(lastround)
  })
  return results
}

async function sendTransaction (to, amount, mnemonic) {
  let results = new Promise(async (resolve, reject) => {
    let account = algosdk.mnemonicToSecretKey(mnemonic)
    let params = await algodclient.getTransactionParams()
    let endRound = params.lastRound + parseInt(1000)
    //create a transaction
    
    let txn = {
        "from": account.addr,
        "to": to,
        "fee": 1,
        "amount": _positiveConversion(amount),
        "firstRound": params.lastRound,
        "lastRound": endRound,
        "genesisID": params.genesisID,
        "genesisHash": params.genesishashb64,
        "note": new Uint8Array(0),
    }
    //sign the transaction
    let signedTxn = algosdk.signTransaction(txn, account.sk)
    //submit the transaction
    if (_positiveConversion(amount) > 0.001) {
      let tx = (await algodclient.sendRawTransaction(signedTxn.blob))
      resolve(tx.txId)
    } else {
      console.log('Amount too small...')
      resolve(false)
    }
  })
  return results
}

async function getBalance (mnemonic) {
  let account = algosdk.mnemonicToSecretKey(mnemonic)
  let results = new Promise(async (resolve, reject) => {
    let url = `${aserver}:${aport}/v1/account/${account.addr}`
    let req = await request.fetchPage(url, atoken)
    let balanceObject = JSON.parse(req)
    resolve(_convert(balanceObject.amount))
  })
  return results
}

function _convert (balance) {
  let res = balance / 1000000
  return res
}

function _positiveConversion (amount) {
  let res = amount * 1000000
  return res
}

module.exports = {
  getLatestBlock,
  sendTransaction,
  getBalance
}