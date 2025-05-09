import { Sequelize } from "sequelize"

const sequelize = new Sequelize('derechos_humanos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})



export default sequelize 