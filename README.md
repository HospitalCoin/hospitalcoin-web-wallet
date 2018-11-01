Fully client side Hospital Coin Web Wallet

# Disclaimer
The project was originally a proof of concept to allow a browser to connect directly on a cryptonight blockchain
It evolved into a new generation of Web Wallet for cryptonight coin, especially for Hospital Coin

# Project
This web wallet is doing everything on the client side, the server is currently only used to optimize
the communication with the daemon and compress the blockchain.  

This requirement may be removed in the future once daemons evolved and returns enough data 

# Security
**No keys, seed or sensitive data are sent to the server**  
If you find a potential security issue, please contact me so we/i can patch it as soon as possible  
Encryption is done with a certified library, [Tweetnacl.Js](https://github.com/dchest/tweetnacl-js)

# Features (non-exhaustive)
- complete wallet sync without server side processing for security
- receive/send history
- mempool support to check incoming transfers
- send coin, qr code scanning included, subaddress support
- receive page to generate a qr code
- import from private keys, mnemonic, json file (exported by the wallet)
- export keys, mnemonic phrase, json file (which include all the history)
- view only wallet
- basic network stats
