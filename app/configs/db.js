const { MongoClient, GridFSBucket } = require('mongodb'); // Only import MongoClient and GridFSBucket here
const mongoose = require('mongoose'); // Import mongoose separately
require('dotenv').config();

const url = process.env.DB_URI;
const dbName = process.env.DB_NAME || 'test';

let client;
let db;
let gridFSBucket;

async function connectToDatabase(uri, dbName) {
    if (!uri) {
        console.error("Lỗi: DB_URI chưa được thiết lập trong biến môi trường.");
        process.exit(1);
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        gridFSBucket = new GridFSBucket(db, { bucketName: 'tempImages' });
        console.log(`Đã kết nối tới MongoDB database "${dbName}" (MongoClient)`);

        // Connect Mongoose SEPARATELY
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: dbName // Use the same dbName
            });
            console.log(`Đã kết nối tới Mongoose database "${dbName}"`);
        } catch (mongooseError) {
            console.error("Lỗi kết nối Mongoose:", mongooseError);
            // Decide how to handle Mongoose connection failure. 
            // You might want to exit or continue without Mongoose functionality.
            // For now, I'm just logging the error and not exiting.
        }

    } catch (error) {
        console.error("Lỗi kết nối MongoClient:", error);
        process.exit(1);
    }
}

function getDb() {
    return db;
}

function getGridFSBucket() {
    return gridFSBucket;
}

async function closeDatabase() {
    if (client) {
        try {
            await client.close();
            console.log("Đã đóng kết nối MongoClient.");
        } catch (error) {
            console.error("Lỗi khi đóng kết nối MongoClient:", error);
        }
    }
    if (mongoose.connection) {
        try {
            await mongoose.connection.close();
            console.log("Đã đóng kết nối Mongoose.");
        } catch (error) {
            console.error("Lỗi khi đóng kết nối Mongoose:", error);
        }
    }
}

module.exports = { connectToDatabase, getDb, getGridFSBucket, closeDatabase, client, mongoose, url, dbName };