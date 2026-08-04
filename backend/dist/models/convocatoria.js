"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const tipodocumentos_1 = __importDefault(require("./tipodocumentos"));
class Convocatoria extends sequelize_1.Model {
    /** Cargo al que aspira la persona, según el sexo que indica su CURP. */
    cargoSegunCurp(curp) {
        const sexo = curp ? curp.charAt(10) : '';
        return (sexo === 'M' ? this.cargo_f : this.cargo_m) || this.nombre;
    }
    /** true si hoy está dentro del periodo de captura de la convocatoria. */
    estaAbierta(fecha = new Date()) {
        if (!this.activa)
            return false;
        if (this.fecha_inicio && fecha < new Date(this.fecha_inicio))
            return false;
        if (this.fecha_fin && fecha > new Date(this.fecha_fin))
            return false;
        return true;
    }
}
Convocatoria.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    titulo: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: false,
    },
    organismo: sequelize_1.DataTypes.STRING(255),
    cargo_f: sequelize_1.DataTypes.STRING(255),
    cargo_m: sequelize_1.DataTypes.STRING(255),
    fundamento: sequelize_1.DataTypes.TEXT('long'),
    aviso_privacidad_url: sequelize_1.DataTypes.STRING(255),
    sede: sequelize_1.DataTypes.TEXT('long'),
    periodo_texto: sequelize_1.DataTypes.STRING(255),
    fecha_inicio: sequelize_1.DataTypes.DATE,
    fecha_fin: sequelize_1.DataTypes.DATE,
    activa: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'convocatorias',
    timestamps: true,
});
// Relaciones
Convocatoria.hasMany(tipodocumentos_1.default, {
    foreignKey: 'convocatoria_id',
    as: 'tipos_documento',
});
tipodocumentos_1.default.belongsTo(Convocatoria, {
    foreignKey: 'convocatoria_id',
    as: 'convocatoria',
});
exports.default = Convocatoria;
