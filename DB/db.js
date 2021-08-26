const Sequelize = require('sequelize');
/* SQLite3
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});
*/

// PostGreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

sequelize.authenticate();
console.log("Database Online!");

const XPEnabled = sequelize.define('xpenable', {
    guild: Sequelize.STRING,
    enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

const Levels = sequelize.define('levels', {
    user: Sequelize.STRING,
    userId: Sequelize.STRING,
    guild: Sequelize.STRING,
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    xp: {
        type: Sequelize.INTEGER,
        defaultValue: 15,
        allowNull: false,
    },
    message_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
});

sequelize.sync({force:true});
module.exports = { XPEnabled, Levels };