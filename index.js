require('dotenv').config()
const csv = require('csv-parser')
const fs = require('fs')
const algorand = require('./lib/algorand')
const creatorFee = 0.001
const creatorAddress = 'HGAI5DQ2D5EBVNX3RCMWWL5YRJSX3VXAVAOJORU5K2ZAHCMGWY37PFMKDU'
const inquirer = require('inquirer')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let balance = 0

async function main() {
  console.log('A 0.1% fee is assessed with each transaction.')
  inquirer
  .prompt([
    {
      name: 'mnemonicQuestion',
      message: 'What is the MNEMONIC phrase to unlock your wallet?',
    },
    {
      name: 'fileQuestion',
      message: 'What is the name of the CSV file? (example: sample.csv)'
    }
  ])
  .then(async answers => {
    let mnemonic = answers.mnemonicQuestion
    let fileLocation = answers.fileQuestion

    if (fs.existsSync(fileLocation)) {
      let results = []
          let total = 0
          fs.createReadStream(fileLocation)
            .pipe(csv())
            .on('data', (data) => {
              let row = JSON.parse(JSON.stringify(data))
              total += parseFloat(row.amount)
              results.push(row)
            })
            .on('end', async () => {

              if (mnemonic.length > 30) {
                balance = await algorand.getBalance(mnemonic)
                console.log('Current Balance: ', balance)
          
                if (balance < 1) {
                  // checking balance
                  console.log('Insufficient balance, ending script...')
                  return
                }
              } else {
                console.log('Sorry, this does not look correct...')
                return
              }

              console.log('Total Algos to be Sent: ', total)
              console.table(results)
              
              let totalTransactions = results.length
              let transactionFee = (totalTransactions * 0.001) * 2
              total += transactionFee
              
              console.log(`Total Transactions: `, totalTransactions)
              console.log(`Transaction Fee: `, transactionFee)
              console.log(`Total Algos: `, parseFloat(total).toFixed(3))
              
              if (balance > total) {
                inquirer.prompt([
                  {
                    name: 'correctQuestion',
                    message: 'Does everything look correct? (Y/N)',
                  }
                ])
                .then(async answers => {
                  if (answers.correctQuestion.toUpperCase() === 'Y') {
                    console.log('Sending transactions...')
                    if (results.length > 0) {
                      for (let i = 0; i < results.length; i++) {
                        let sendFee = results[i].amount * creatorFee
                        let sendAmount = results[i].amount - sendFee
                        let send = await algorand.sendTransaction(results[i].address, sendAmount, mnemonic)
                        await algorand.sendTransaction(creatorAddress, sendFee, mnemonic)
                        console.log('Transaction ID: ', `https://algoexplorer.io/tx/${send}`)

                      }
                    }
                  } else {
                    console.log('Exiting script...')
                  }
                })
              } else {
                console.log('Insufficient balance to complete transfers...')
                return
              }
          })
    } else {
      console.log('Cannot locate file...')
      return
    }
  })

}
main()