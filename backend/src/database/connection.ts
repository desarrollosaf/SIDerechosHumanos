import { Sequelize } from "sequelize"


const sequelize = new Sequelize('cddiputados-v2', 'homestead', 'secret',{
    host: '192.168.10.10',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})
// const sequelize = new Sequelize('pos', 'root', '1004',{
//     host: 'localhost',
//     dialect: 'mysql'
// })

export default sequelize