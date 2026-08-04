'use strict';

/**
 * Tipos de documento de la convocatoria de Derechos Humanos (convocatoria 1).
 *
 * Cada renglón es: [valor, orden, max_mb, obligatorio, requisito, documento_requerido]
 * donde "requisito" es el texto legal que se muestra en negritas y
 * "documento_requerido" el nombre del archivo que debe cargar la persona aspirante.
 *
 * @type {import('sequelize-cli').Migration}
 */

const AVISO = 'https://legislacion.legislativoedomex.gob.mx/avisosdeprivacidad';

const DOCS = [
  ['acta_nacimiento', 1, 15, true,
    'I. Tener treinta y cinco años cumplidos, el día de su elección.',
    'Acta de nacimiento en copia certificada o, en su caso, documento que acredite la nacionalidad mexicana'],
  ['curp', 2, 15, true,
    'II. Ser mexicano en pleno goce y ejercicio de sus derechos políticos y civiles.',
    'Clave Única de Registro de Población (CURP)'],
  ['ine', 3, 15, true,
    'III. Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible, de preferencia ampliada al 200% y en original para su cotejo.',
    'Credencial para votar con fotografía vigente'],
  ['constancia_residencia', 4, 15, true,
    'IV. Tener residencia efectiva en el territorio del Estado de México no menor de cinco años anteriores al día de su elección.',
    'Constancia de residencia en la entidad no menor de cinco años anteriores al día de su designación, que podrá acreditarse con manifestación bajo protesta de decir verdad sobre su residencia'],
  ['curriculum', 5, 100, true,
    'V. Currículum Vitae firmado autógrafamente por la persona aspirante, en el que se señale su experiencia laboral, formación académica; especialización en derechos humanos; experiencia profesional en el ámbito de la protección, observancia, promoción, estudio y divulgación de los derechos humanos; y, en su caso, publicaciones en materias relacionadas con los derechos humanos.',
    'Currículum Vitae'],
  ['copia_certificada', 6, 100, true,
    'VI. Copia certificada de los documentos con los que acredite su título(s) o grado(s) académico(s).',
    'Copias certificadas correspondientes'],
  ['informe_no_penales', 7, 15, true,
    'VII. Informe de no antecedentes penales, expedido por la Fiscalía General de Justicia del Estado de México, con fecha de expedición no mayor a treinta días anteriores a la fecha de su presentación.',
    'Informe de no antecedentes penales'],
  ['carta_protesta5', 8, 15, true,
    'VIII. Carta bajo protesta de decir verdad en donde señale: a) No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección. b) No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección. c) No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos. d) No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado.',
    'Carta bajo protesta de decir verdad'],
  ['titulo_licenciatura', 9, 100, true,
    'Otros documentos probatorios o que considere de relevancia para su postulación.',
    'Otros'],
  ['carta_ant_no_penales', 10, 7, false,
    'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada, por delito intencional.',
    'Carta bajo protesta de decir verdad y/o carta de antecedentes no penales'],
  ['propuesta_programa', 11, 50, true,
    'Documento impreso con la propuesta de programa de trabajo con una extensión máxima de diez cuartillas, con letra tipo Arial, tamaño número 12 e interlineado 1.5.',
    'Propuesta de programa de trabajo'],
  ['carta_motivos', 12, 15, true,
    'Carta de exposición de motivos firmada por la persona aspirante y descripción de las razones que justifican su idoneidad, con una extensión no mayor a tres cuartillas.',
    'Carta de exposición de motivos'],
  ['escrito_consentimiento', 13, 15, true,
    `Escrito de consentimiento para el tratamiento de datos personales, así como Aviso de Privacidad relativo al tratamiento de los datos personales descritos en la presente Convocatoria. Ambos documentos deberán descargarse de la página ${AVISO} y deberán ser entregados debidamente firmados por la o el aspirante.`,
    'Escrito de consentimiento'],

  // Requisitos que se acreditan dentro de la carta bajo protesta y que ya no se
  // capturan por separado; se conservan para no romper expedientes anteriores.
  ['carta_protesta1', 90, 15, false,
    'No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección.',
    'Carta bajo protesta de decir verdad'],
  ['carta_protesta2', 91, 15, false,
    'No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección.',
    'Carta bajo protesta de decir verdad'],
  ['carta_protesta3', 92, 15, false,
    'No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos.',
    'Carta bajo protesta de decir verdad'],
  ['carta_protesta4', 93, 15, false,
    'No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado.',
    'Carta bajo protesta de decir verdad'],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const [existentes] = await queryInterface.sequelize.query(
      'SELECT id FROM tipodocumentos WHERE convocatoria_id = 1 LIMIT 1'
    );
    if (existentes.length > 0) {
      return;
    }

    const ahora = new Date();

    await queryInterface.bulkInsert(
      'tipodocumentos',
      DOCS.map(([valor, orden, maxMb, obligatorio, requisito, documento]) => ({
        convocatoria_id: 1,
        valor,
        valor_real: requisito,
        documento_requerido: documento,
        orden,
        obligatorio,
        max_mb: maxMb,
        createdAt: ahora,
        updatedAt: ahora,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipodocumentos', { convocatoria_id: 1 }, {});
  }
};
