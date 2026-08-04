'use strict';

/**
 * Convierte el sistema de una sola convocatoria (Derechos Humanos) a multiconvocatoria.
 *
 * 1. Da de alta las tres convocatorias (la existente queda con id 1).
 * 2. Agrega convocatoria_id a solicituds y tipodocumentos, y asigna todo lo
 *    que ya existe a la convocatoria 1 (Derechos Humanos).
 * 3. Enriquece tipodocumentos con los datos que hasta ahora vivían en el HTML
 *    (orden de despliegue, nombre del documento, si es obligatorio y peso máximo).
 *
 * @type {import('sequelize-cli').Migration}
 */

const AVISO = 'https://legislacion.legislativoedomex.gob.mx/avisosdeprivacidad';

const CONVOCATORIAS = [
  {
    id: 1,
    slug: 'derechos-humanos',
    nombre: 'Presidencia de la Comisión de Derechos Humanos del Estado de México',
    titulo:
      'Proceso y Convocatoria para elegir o reelegir a la Presidenta o el Presidente de la Comisión de Derechos Humanos del Estado de México.',
    organismo: 'Comisión de Derechos Humanos del Estado de México',
    cargo_f: 'Presidenta de la Comisión de Derechos Humanos del Estado de México',
    cargo_m: 'Presidente de la Comisión de Derechos Humanos del Estado de México',
    fundamento:
      'los requisitos establecidos en el artículo 17 de la Ley de la Comisión de Derechos Humanos del Estado de México',
    aviso_privacidad_url: 'https://legislacion.congresoedomex.gob.mx/avisosdeprivacidad',
    sede: null,
    periodo_texto: null,
    fecha_inicio: null,
    fecha_fin: null,
    activa: false
  },
  {
    id: 2,
    slug: 'contraloria-teem',
    nombre: 'Contraloría General del Tribunal Electoral del Estado de México',
    titulo:
      'Proceso y Convocatoria para la designación o ratificación de la persona Titular de la Contraloría General del Tribunal Electoral del Estado de México.',
    organismo: 'Tribunal Electoral del Estado de México',
    cargo_f: 'Titular de la Contraloría General del Tribunal Electoral del Estado de México',
    cargo_m: 'Titular de la Contraloría General del Tribunal Electoral del Estado de México',
    fundamento:
      'los requisitos establecidos en el artículo 399 del Código Electoral del Estado de México',
    aviso_privacidad_url: AVISO,
    sede:
      'Salón de Protocolo "Isidro Fabela Alfaro", recinto del Poder Legislativo, Plaza Hidalgo s/n, Col. Centro, Toluca de Lerdo, Estado de México, C.P. 50000.',
    periodo_texto: '11, 14 y 15 de septiembre de 2026, en un horario de 10:00 a 17:00 horas',
    fecha_inicio: new Date('2026-09-11T10:00:00'),
    fecha_fin: new Date('2026-09-15T17:00:00'),
    activa: true
  },
  {
    id: 3,
    slug: 'oic-trijaem',
    nombre: 'Órgano Interno de Control del Tribunal de Justicia Administrativa del Estado de México',
    titulo:
      'Proceso y Convocatoria para la designación o ratificación de la persona Titular del Órgano Interno de Control del Tribunal de Justicia Administrativa del Estado de México.',
    organismo: 'Tribunal de Justicia Administrativa del Estado de México',
    cargo_f:
      'Titular del Órgano Interno de Control del Tribunal de Justicia Administrativa del Estado de México',
    cargo_m:
      'Titular del Órgano Interno de Control del Tribunal de Justicia Administrativa del Estado de México',
    fundamento:
      'los requisitos establecidos en los artículos 80, 81 y 82 de la Ley Orgánica del Tribunal de Justicia Administrativa del Estado de México',
    aviso_privacidad_url: AVISO,
    sede:
      'Salón de Protocolo "Isidro Fabela Alfaro", recinto del Poder Legislativo, Plaza Hidalgo s/n, Col. Centro, Toluca de Lerdo, Estado de México, C.P. 50000.',
    periodo_texto: '11, 14 y 15 de septiembre de 2026, en un horario de 10:00 a 17:00 horas',
    fecha_inicio: new Date('2026-09-11T10:00:00'),
    fecha_fin: new Date('2026-09-15T17:00:00'),
    activa: true
  }
];

/**
 * Metadatos de los documentos de Derechos Humanos, tal como estaban escritos a
 * mano en add-edit-documentos.component.html. Se pasan a base de datos para que
 * el formulario se construya solo.
 */
const DOCS_DH = [
  ['acta_nacimiento', 1, 15, true, 'I. Tener treinta y cinco años cumplidos, el día de su elección.', 'Acta de nacimiento en copia certificada o, en su caso, documento que acredite la nacionalidad mexicana'],
  ['curp', 2, 15, true, 'II. Ser mexicano en pleno goce y ejercicio de sus derechos políticos y civiles.', 'Clave Única de Registro de Población (CURP)'],
  ['ine', 3, 15, true, 'III. Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible, de preferencia ampliada al 200% y en original para su cotejo.', 'Credencial para votar con fotografía vigente'],
  ['constancia_residencia', 4, 15, true, 'IV. Tener residencia efectiva en el territorio del Estado de México no menor de cinco años anteriores al día de su elección.', 'Constancia de residencia en la entidad no menor de cinco años anteriores al día de su designación, que podrá acreditarse con manifestación bajo protesta de decir verdad sobre su residencia'],
  ['curriculum', 5, 100, true, 'V. Currículum Vitae firmado autógrafamente por la persona aspirante, en el que se señale su experiencia laboral, formación académica; especialización en derechos humanos; experiencia profesional en el ámbito de la protección, observancia, promoción, estudio y divulgación de los derechos humanos; y, en su caso, publicaciones en materias relacionadas con los derechos humanos.', 'Currículum Vitae'],
  ['copia_certificada', 6, 100, true, 'VI. Copia certificada de los documentos con los que acredite su título(s) o grado(s) académico(s).', 'Copias certificadas correspondientes'],
  ['informe_no_penales', 7, 15, true, 'VII. Informe de no antecedentes penales, expedido por la Fiscalía General de Justicia del Estado de México, con fecha de expedición no mayor a treinta días anteriores a la fecha de su presentación.', 'Informe de no antecedentes penales'],
  ['carta_protesta5', 8, 15, true, 'VIII. Carta bajo protesta de decir verdad en donde señale: a) No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección. b) No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección. c) No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos. d) No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado.', 'Carta bajo protesta de decir verdad'],
  ['titulo_licenciatura', 9, 100, true, 'Otros documentos probatorios o que considere de relevancia para su postulación.', 'Otros'],
  ['carta_ant_no_penales', 10, 7, false, 'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada, por delito intencional.', 'Carta bajo protesta de decir verdad y/o carta de antecedentes no penales'],
  ['propuesta_programa', 11, 50, true, 'Documento impreso con la propuesta de programa de trabajo con una extensión máxima de diez cuartillas, con letra tipo Arial, tamaño número 12 e interlineado 1.5.', 'Propuesta de programa de trabajo'],
  ['carta_motivos', 12, 15, true, 'Carta de exposición de motivos firmada por la persona aspirante y descripción de las razones que justifican su idoneidad, con una extensión no mayor a tres cuartillas.', 'Carta de exposición de motivos'],
  ['escrito_consentimiento', 13, 15, true, `Escrito de consentimiento para el tratamiento de datos personales, así como Aviso de Privacidad relativo al tratamiento de los datos personales descritos en la presente Convocatoria. Ambos documentos deberán descargarse de la página ${AVISO} y deberán ser entregados debidamente firmados por la o el aspirante.`, 'Escrito de consentimiento'],
  // Documentos que ya no se muestran en el formulario pero cuyos registros
  // históricos deben conservar su tipo. Quedan al final y sin obligatoriedad.
  ['carta_protesta1', 90, 15, false, null, 'Carta bajo protesta de decir verdad'],
  ['carta_protesta2', 91, 15, false, null, 'Carta bajo protesta de decir verdad'],
  ['carta_protesta3', 92, 15, false, null, 'Carta bajo protesta de decir verdad'],
  ['carta_protesta4', 93, 15, false, null, 'Carta bajo protesta de decir verdad']
];

/**
 * MySQL confirma cada DDL de inmediato, así que una migración interrumpida deja
 * la base a medias y el reintento truena. Por eso cada paso se salta solo si ya
 * está aplicado.
 */
async function agregarColumna(queryInterface, tabla, columna, definicion) {
  const columnas = await queryInterface.describeTable(tabla);
  if (!columnas[columna]) {
    await queryInterface.addColumn(tabla, columna, definicion);
  }
}

async function existeConstraint(queryInterface, nombre) {
  const [filas] = await queryInterface.sequelize.query(
    `SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = :nombre LIMIT 1`,
    { replacements: { nombre } }
  );
  return filas.length > 0;
}

async function existeIndice(queryInterface, tabla, nombre) {
  const indices = await queryInterface.showIndex(tabla);
  return indices.some((indice) => indice.name === nombre);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const ahora = new Date();

    // --- 1. Alta de convocatorias ------------------------------------------
    const [existentes] = await queryInterface.sequelize.query(
      'SELECT slug FROM convocatorias'
    );
    const yaRegistradas = existentes.map((c) => c.slug);
    const faltantes = CONVOCATORIAS.filter((c) => !yaRegistradas.includes(c.slug));

    if (faltantes.length > 0) {
      await queryInterface.bulkInsert(
        'convocatorias',
        faltantes.map((c) => ({ ...c, createdAt: ahora, updatedAt: ahora }))
      );
    }

    // --- 2. Columnas nuevas -------------------------------------------------
    await agregarColumna(queryInterface, 'solicituds', 'convocatoria_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await agregarColumna(queryInterface, 'tipodocumentos', 'convocatoria_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
    await agregarColumna(queryInterface, 'tipodocumentos', 'documento_requerido', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });
    await agregarColumna(queryInterface, 'tipodocumentos', 'orden', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await agregarColumna(queryInterface, 'tipodocumentos', 'obligatorio', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await agregarColumna(queryInterface, 'tipodocumentos', 'max_mb', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 15
    });

    // --- 3. Backfill de los tipos de documento de Derechos Humanos ----------
    for (const [valor, orden, maxMb, obligatorio, requisito, documento] of DOCS_DH) {
      const campos = {
        convocatoria_id: 1,
        orden,
        max_mb: maxMb,
        obligatorio,
        documento_requerido: documento,
        updatedAt: ahora
      };
      // Solo se reescribe el requisito cuando el HTML tenía un texto más
      // completo que el sembrado originalmente (numeración e incisos).
      if (requisito) {
        campos.valor_real = requisito;
      }
      await queryInterface.bulkUpdate('tipodocumentos', campos, { valor, convocatoria_id: 1 });
    }

    // --- 4. Llaves foráneas -------------------------------------------------
    if (!(await existeConstraint(queryInterface, 'fk_solicituds_convocatoria'))) {
      await queryInterface.addConstraint('solicituds', {
        fields: ['convocatoria_id'],
        type: 'foreign key',
        name: 'fk_solicituds_convocatoria',
        references: { table: 'convocatorias', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }

    if (!(await existeConstraint(queryInterface, 'fk_tipodocumentos_convocatoria'))) {
      await queryInterface.addConstraint('tipodocumentos', {
        fields: ['convocatoria_id'],
        type: 'foreign key',
        name: 'fk_tipodocumentos_convocatoria',
        references: { table: 'convocatorias', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }

    if (!(await existeIndice(queryInterface, 'tipodocumentos', 'idx_tipodocumentos_convocatoria_valor'))) {
      await queryInterface.addIndex('tipodocumentos', ['convocatoria_id', 'valor'], {
        name: 'idx_tipodocumentos_convocatoria_valor',
        unique: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('tipodocumentos', 'idx_tipodocumentos_convocatoria_valor');
    await queryInterface.removeConstraint('tipodocumentos', 'fk_tipodocumentos_convocatoria');
    await queryInterface.removeConstraint('solicituds', 'fk_solicituds_convocatoria');

    await queryInterface.removeColumn('tipodocumentos', 'max_mb');
    await queryInterface.removeColumn('tipodocumentos', 'obligatorio');
    await queryInterface.removeColumn('tipodocumentos', 'orden');
    await queryInterface.removeColumn('tipodocumentos', 'documento_requerido');
    await queryInterface.removeColumn('tipodocumentos', 'convocatoria_id');
    await queryInterface.removeColumn('solicituds', 'convocatoria_id');

    await queryInterface.bulkDelete('convocatorias', null, {});
  }
};
