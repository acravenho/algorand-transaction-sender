# ALGORAND Transaction Sender

This script sends out transactions based upon the values contained in the supplied CSV file. When the script is run, the end user will be prompted for information. Below is a list of these prompts.

1. What is the MNEMONIC phrase to unlock your wallet?
2. What is the name of the CSV file? (example: sample.csv)
3. A final prompt will be provided to ensure all the information is correct.

## Requirements

1. NodeJS v11.2.0 and NPM v6.9.0 (`brew install node`)
2. Git (`brew install git`)

## Installation

1. `git clone https://github.com/acravenho/algorand-transaction-sender.git`
2. `cd algorand-transaction-sender`
3. `npm install`
4. Place your CSV file in the `algorand-transaction-sender` folder. You will be asked for the name of this file during step 3 below.

## Start the app
1. `node index`
2. You will be asked for your Mnemonic phrase in order to unlock your wallet.
3. Next, you'll be asked the name of your CSV file that you placed in the `algorand-transaction-sender` folder.
4. The script will provide a table of all addresses and amounts to be sent.
5. Confirm this information. Enter `Y` if correct, `N` if incorrect.
6. All transaction hashes will be printed out.



