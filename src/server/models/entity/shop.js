const Sequelize = require('sequelize');
module.exports = function(){
    return {
        id: {
            type: Sequelize.INTEGER(20),
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true
        },
        shop_name: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false
        },
        shop_url: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: true
        },
        access_token: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: true
        }
    };
};
