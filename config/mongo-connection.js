const mongoose = require('mongoose');
const OPTIONS = require('./constant').mongodb;
const dbURI = OPTIONS.url;

mongoose.Promise = global.Promise;
const connectOptions = { useNewUrlParser: true };

// Create the database connection
mongoose.connect(
    dbURI,
    connectOptions
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => console.log(`Connected to Mongo server at: ${dbURI}`));

// If the connection throws an error
mongoose.connection.on('error', err => {
    console.log(`Mongoose default connection error: ${err}`);
    new Error(`Connection error mongo server:`);
    process.exit(1);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => logger.error(`Mongoose default connection disconnected`));
module.exports = mongoose.connection;