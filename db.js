const { Pool, Client } = require('pg')
exports.query = function(query, params, callback, originalRes, layoutName) {
    console.log("DB QUERY");
    //const connectionString = "postgres://ulxouuifxljact:a29ff5ec3cb4ead4b7b8c92c2f01367eaeedb9325fe51d4a194ff3304803f9d8@ec2-63-34-223-144.eu-west-1.compute.amazonaws.com:5432/dbj733ha962jhl";
    const client = new Client({
        user: "ulxouuifxljact",
        password: "a29ff5ec3cb4ead4b7b8c92c2f01367eaeedb9325fe51d4a194ff3304803f9d8",
        database: "dbj733ha962jhl",
        port: 5432,
        host: "ec2-63-34-223-144.eu-west-1.compute.amazonaws.com",
        rejectUnauthorized: false,
        ssl: true
    })
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack);
            callback(err, originalRes);
        }
        else {
            console.log("connected");
        }
    })
 
    client.query(query, params, (err, res) => {
        if (err) {
            console.log(err.stack)
            callback(err, originalRes);
        } else {
            
            callback(err, originalRes, res, layoutName);
            client.end(); 
        }
    });
};