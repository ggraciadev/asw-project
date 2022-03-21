const { Pool, Client } = require('pg')
exports.query = function(query, params, callback, originalRes, layoutName, gameName) {
    const connectionString = "postgres://sdyqcziocuczov:838a17001f2d3115d4a8979729ea33ef7b176c67c088f6d4b3d418bfa3b34408@ec2-54-217-207-242.eu-west-1.compute.amazonaws.com:5432/d1qh059savueha"
      + "?ssl=true";
    const client = new Client({
      connectionString: connectionString,
    })
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack);
            callback(err, originalRes);
        }
    })
 
    client.query(query, params, (err, res) => {
        if (err) {
            console.log(err.stack)
            callback(err, originalRes);
        } else {
            callback(err, originalRes, res, layoutName, gameName);
            client.end(); /*Aquesta funció te la vas deixar i  per tant, petava ja que 
            heroku nomes permet 20 connexions i constantment estas obrint connexions pero
            no les tanques (una molt mala pràctica) i aleshores es queden infinites connexions
            escoltant pero sense utilitzar-les. Encara que utilitzar la mateixa connexió reutilitzant-la
            seria molt més òptim.
            */
        }
    });
};