import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';
import TipoDocumentos from './tipodocumentos';

class Convocatoria extends Model<
  InferAttributes<Convocatoria>,
  InferCreationAttributes<Convocatoria>
> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare nombre: string;
  declare titulo: string;
  declare organismo: string | null;
  declare cargo_f: string | null;
  declare cargo_m: string | null;
  declare fundamento: string | null;
  declare aviso_privacidad_url: string | null;
  declare sede: string | null;
  declare periodo_texto: string | null;
  declare fecha_inicio: Date | null;
  declare fecha_fin: Date | null;
  declare activa: CreationOptional<boolean>;

  // Relaciones
  declare tipos_documento?: TipoDocumentos[];

  /** Cargo al que aspira la persona, según el sexo que indica su CURP. */
  cargoSegunCurp(curp: string | null): string {
    const sexo = curp ? curp.charAt(10) : '';
    return (sexo === 'M' ? this.cargo_f : this.cargo_m) || this.nombre;
  }

  /** true si hoy está dentro del periodo de captura de la convocatoria. */
  estaAbierta(fecha: Date = new Date()): boolean {
    if (!this.activa) return false;
    if (this.fecha_inicio && fecha < new Date(this.fecha_inicio)) return false;
    if (this.fecha_fin && fecha > new Date(this.fecha_fin)) return false;
    return true;
  }
}

Convocatoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    organismo: DataTypes.STRING(255),
    cargo_f: DataTypes.STRING(255),
    cargo_m: DataTypes.STRING(255),
    fundamento: DataTypes.TEXT('long'),
    aviso_privacidad_url: DataTypes.STRING(255),
    sede: DataTypes.TEXT('long'),
    periodo_texto: DataTypes.STRING(255),
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'convocatorias',
    timestamps: true,
  }
);

// Relaciones
Convocatoria.hasMany(TipoDocumentos, {
  foreignKey: 'convocatoria_id',
  as: 'tipos_documento',
});
TipoDocumentos.belongsTo(Convocatoria, {
  foreignKey: 'convocatoria_id',
  as: 'convocatoria',
});

export default Convocatoria;
