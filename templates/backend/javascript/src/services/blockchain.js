/*  This file does the work of connecting to the blockchain nodes   */

const path = require('path');   
const fs = require('fs');

/* The actual libraries that allow us to create a wallet and a connection gateway    */
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');   
const FabricCAServices = require('fabric-ca-client');

/*  Loads env variables */
const { 
    CONNECTION_PROFILE,
    CA_URL,
    CA_ADMIN_USER,
    CA_ADMIN_PASSWORD,
    MSPID,
    DISCOVERY,
    ISLOCAL,
    CHANNEL,
    CHAINCODE_NAME,
    SMART_CONTRACT_NAME,
    
 } = require('../config/env');


/*  Wallet that contains a valid identity to access the blockchain */
const wallet = new FileSystemWallet(path.join('wallet'));

/*  Loads the connection profile to get the network topology (nodes url, certificates, etc)  */
const connectionProfilePath = path.resolve(__dirname, '..', 'config', CONNECTION_PROFILE);
const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));


/*  This method uses a wallet and a connection profile 
    to establish a gateway connection to the wanted network, returning the network object.  */
function getNetwork() {
    return new Promise(async (resolve, reject) => {
        try {
            
            const gateway = new Gateway();

            const connectionOptions = {
                identity: CA_ADMIN_USER,
                wallet: wallet,
                discovery: { enabled: (DISCOVERY == 'true'), asLocalhost: (ISLOCAL == 'true') }
            };

            await gateway.connect(connectionProfile, connectionOptions);
            const network = await gateway.getNetwork(CHANNEL);

            resolve(network);

        }
        catch (error) {
            reject(error);
        }
    })
}

/* Creates a valid identity to be able to make transactions. Save it into the filesystem wallet  */
function createIdentity(id, secret) {
    return new Promise(async (resolve, reject) => {
        try {
            
            const ca = new FabricCAServices(CA_URL);
            
            const alreadyExists = await wallet.exists(id);
            if (alreadyExists) {
                console.log(`An identity ${id} already exists`);
                return;
            }

            console.log("Enrolling identity...");
            const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: secret });
            console.log("Generating a identity...");
            const identity = X509WalletMixin.createIdentity(MSPID, enrollment.certificate, enrollment.key.toBytes());
            console.log("Saving identity...");
            await wallet.import(id, identity);
            console.log("Identity created successfully");
            resolve();

        }
        catch (error) {
            reject(error);
        }
    })
}


/*  Everytime the application runs, tries to create an identity    */
async function makeIdentity(){
    await createIdentity(CA_ADMIN_USER, CA_ADMIN_PASSWORD)
}

makeIdentity()


module.exports = {

    /*  Finds the smart contract which contains all the transactions to be made   */
    async getContract(){
        return new Promise(async (resolve, reject) => {
            try {
                const network = await getNetwork();
                const contract = await network.getContract(CHAINCODE_NAME, SMART_CONTRACT_NAME);
                resolve(contract)

            } catch (error) {
                reject(error);
            }
        })
    }
}

