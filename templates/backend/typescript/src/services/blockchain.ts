/*  This file does the work of connecting to the blockchain nodes   */

import path from 'path';   

/* The actual libraries that allow us to create a wallet and a connection gateway    */
import { FileSystemWallet, Gateway, X509WalletMixin, Wallet, Network, Contract } from 'fabric-network';   
import FabricCAServices from 'fabric-ca-client';
import jsonParser from '../lib/json_parser';


/*  Loads env variables */
import { 
    CONNECTION_PROFILE,
    CA_URL,
    CA_ADMIN_USER,
    CA_ADMIN_PASSWORD,
    MSPID,
    DISCOVERY,
    ISLOCAL,
    CHANNEL,
    CHAINCODE_NAME,
    SMART_CONTRACT_NAME
 } from '../config';

/*  Wallet that contains a valid identity to access the blockchain */
const wallet: Wallet = new FileSystemWallet(path.join('wallet'));

/*  Loads the connection profile to get the network topology (nodes url, certificates, etc)  */
const connectionProfile = jsonParser(CONNECTION_PROFILE)


/*  This method uses a wallet and a connection profile 
    to establish a gateway connection to the wanted network, returning the network object.  */
function getNetwork() : Promise<Network> {
    return new Promise<Network>(async (resolve, reject) => {
        try {
            
            const gateway: Gateway = new Gateway();

            const connectionOptions = {
                identity: CA_ADMIN_USER,
                wallet: wallet,
                discovery: { enabled: (DISCOVERY == 'true'), asLocalhost: (ISLOCAL == 'true') }
            };

            await gateway.connect(connectionProfile, connectionOptions);
            const network: Network = await gateway.getNetwork(CHANNEL);
            resolve(network);
        }
        catch (error) {
            reject(error);
        }
    })
}

/* Creates a valid identity to be able to make transactions. Save it into the filesystem wallet  */
(function createIdentity(id: string, secret: string, mspid: string, ca_url) : Promise<any> {
    return new Promise<any> (async (resolve, reject) => {
        try {
            
            const ca = new FabricCAServices(ca_url);
            
            const alreadyExists = await wallet.exists(id);
            if (alreadyExists) {
                console.log(`An identity ${id} already exists`);
                return;
            }

            console.log("Enrolling identity...");
            const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: secret });
            console.log("Generating a identity...");
            const identity = X509WalletMixin.createIdentity(mspid, enrollment.certificate, enrollment.key.toBytes());
            console.log("Saving identity...");
            await wallet.import(id, identity);
            console.log("Identity created successfully");
            resolve();

        }
        catch (error) {
            console.log(JSON.stringify(error, null, 2));
            reject(error);
        }
    })
})(CA_ADMIN_USER, CA_ADMIN_PASSWORD, MSPID, CA_URL)


export async function getContract() : Promise<Contract> {
        return new Promise<Contract>(async (resolve, reject) => {
            try {
                const network: Network = await getNetwork();
                const contract: Contract = await network.getContract(CHAINCODE_NAME, SMART_CONTRACT_NAME);
                resolve(contract)

            } catch (error) {
                reject(error);
            }
        })
    }


