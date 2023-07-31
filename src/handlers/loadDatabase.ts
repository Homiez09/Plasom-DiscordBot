import { connect } from "mongoose";
import "dotenv/config"

module.exports = async () => {
    if (!process.env.dbURL)return console.log('The client is not connected to the database.');
    await connect(process.env.dbURL);
    console.log('Database connected.');
};
