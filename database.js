const mysql = require('mysql2');
module.exports = function databaseClient(config, service) {
    const connection = mysql.createConnection(config);

    function executeQuery(sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        })
    }

    async function createTables() {
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS service (
                type VARCHAR(255) PRIMARY KEY
            );`);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS reservation (
                id INT PRIMARY KEY AUTO_INCREMENT,
                data DATE NOT NULL,
                ora INT NOT NULL,
                cliente VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                CONSTRAINT FK_type FOREIGN KEY (type) REFERENCES service(type)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );`);
        for(const typo of service){
            await executeQuery(`INSERT IGNORE INTO service (type) VALUES ('${typo}');`);
        }
    }

    createTables();
    return {
        insert: async function (data) {
            let sql = `INSERT IGNORE INTO reservation (data, ora, cliente, type) VALUES ('${data.data}', ${data.ora}, '${data.cliente}', '${data.type}');`;
            return await executeQuery(sql);
        },
        selectAll: async function () {
            let sql = `SELECT data, ora, cliente, type FROM reservation;`;
            const results = await executeQuery(sql);
            let data = {};
            console.log(results);
            results.forEach(e => {data[(`${e.type}-${String(new Date(e.data).getUTCDate()).padStart(2, '0')}${String(new Date(e.data).getUTCMonth() + 1).padStart(2, '0')}${new Date(e.data).getUTCFullYear()}-${e.ora}`)] = e.cliente});
            return data;
        },
    }
}