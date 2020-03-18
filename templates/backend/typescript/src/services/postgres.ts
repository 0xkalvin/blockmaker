import { Sequelize, QueryTypes } from 'sequelize';
import { POSTGRES_CREDENTIALS } from '../config';
import jsonParser from '../lib/json_parser';

const postgresCredentials = jsonParser(POSTGRES_CREDENTIALS)
const connectionObject = postgresCredentials.services["databases-for-postgresql"][0].credentials.connection.postgres;
const connectionURL: string = connectionObject.composed[0];
const caCert = Buffer.from(connectionObject.certificate.certificate_base64, 'base64').toString();

const sequelize = new Sequelize(connectionURL, {
    dialectOptions: {
        ssl: {
            cert: caCert,
            rejectUnauthorized: false,
        }
    }
})

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);

    })


export {
    sequelize,
    QueryTypes,
}