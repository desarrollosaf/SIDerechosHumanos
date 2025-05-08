import { Sequelize } from "sequelize"

const sequelize = new Sequelize('derechos_humanos', 'homestead', 'secret', {
    host: '192.168.10.10',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})



export default sequelize 