'use strict';

/**
 * Tipos de documento de las convocatorias 2026:
 *  - contraloria-teem : Contraloría General del Tribunal Electoral del Estado de México
 *  - oic-trijaem      : Órgano Interno de Control del Tribunal de Justicia Administrativa
 *
 * Cada renglón es: [valor, orden, max_mb, obligatorio, requisito, documento_requerido]
 * donde "requisito" es el texto legal que se muestra en negritas y
 * "documento_requerido" el nombre del archivo que debe cargar la persona aspirante.
 *
 * @type {import('sequelize-cli').Migration}
 */

const AVISO = 'https://legislacion.legislativoedomex.gob.mx/avisosdeprivacidad';

const CONSENTIMIENTO = `Escrito de consentimiento para el tratamiento de datos personales, así como Aviso de Privacidad relativo al tratamiento de los datos personales descritos en la presente Convocatoria. Ambos documentos deberán descargarse de la página ${AVISO} y deberán ser entregados debidamente firmados por la o el aspirante.`;

const DOCS_TEEM = [
  ['acta_nacimiento', 1, 15, true,
    'I. Ser ciudadana o ciudadano mexicano por nacimiento y tener al menos treinta años cumplidos.',
    'Acta de nacimiento en copia certificada o, en su caso, documento que acredite la nacionalidad mexicana'],
  ['curp', 2, 15, true,
    'II. Estar en pleno ejercicio de sus derechos políticos.',
    'Clave Única de Registro de Población (CURP)'],
  ['ine', 3, 15, true,
    'III. Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible y en original para su cotejo.',
    'Credencial para votar con fotografía vigente'],
  ['constancia_residencia', 4, 15, true,
    'IV. Haber residido en el Estado durante los tres años previos a la designación.',
    'Constancia de residencia en la entidad no menor de tres años anteriores al día de su designación o, en su defecto, manifestación bajo protesta de decir verdad sobre el cumplimiento de dicho requisito'],
  ['curriculum', 5, 50, true,
    'V. Contar, al momento de su designación, con experiencia profesional en materia contable, de auditoría o fiscalización en el ámbito político electoral, debiendo comprobar en estos rubros una antigüedad de al menos tres años.',
    'Currículum vitae firmado por la persona aspirante, acompañado de los documentos probatorios que considere'],
  ['titulo_profesional', 6, 50, true,
    'VI. Contar, al día de su designación, con título profesional en áreas afines a sus funciones, con una antigüedad mínima de tres años.',
    'Título profesional en áreas afines a sus funciones, en copia legible y en original para su cotejo'],
  ['informe_no_penales', 7, 15, true,
    'VII. Gozar de buena reputación y no haber sido condenado por delito intencional que amerite pena corporal de más de un año de prisión; pero si se tratara de robo, fraude, falsificación, abuso de confianza u otro que afecte la buena fama en el concepto público, ello lo inhabilitará para el cargo, cualquiera que haya sido la pena.',
    'Informe de no antecedentes penales'],
  ['carta_protesta', 8, 15, true,
    'VIII. Carta bajo protesta de decir verdad en donde manifieste: a) No tener ni haber tenido cargo alguno de elección popular ni haber sido candidato o precandidato, en los tres años anteriores a la designación. b) No desempeñar ni haber desempeñado cargo de dirección nacional, estatal, distrital o municipal en algún partido político en los tres años anteriores a la designación. c) No ser ministro de culto religioso alguno. d) No ser consejero electoral del Consejo General, o en su caso, haberse separado del cargo tres años antes del día de la designación. e) Gozar de buena reputación. f) No pertenecer o haber pertenecido en los tres años anteriores a su designación a despachos de consultoría o auditoría que hubieren prestado sus servicios a algún partido político.',
    'Carta bajo protesta de decir verdad'],
  ['certificado_no_deudor', 9, 15, true,
    'IX. Certificado de No Deudor Alimentario, expedido por el Registro Nacional de Obligaciones Alimentarias.',
    'Certificado de No Deudor Alimentario'],
  ['carta_solicitud_inscripcion', 10, 15, true,
    'X. Carta de solicitud de inscripción con firma autógrafa en donde se manifieste su intención de participar en el proceso de designación y de aceptar las disposiciones del mismo.',
    'Carta de solicitud de inscripción'],
  ['carta_motivos', 11, 15, true,
    'XI. Carta de exposición de motivos de su aspiración.',
    'Carta de exposición de motivos'],
  ['carta_aceptacion_bases', 12, 15, true,
    'XII. Carta con firma autógrafa en la que manifieste la aceptación de las bases, procedimientos, deliberaciones y resoluciones de la presente convocatoria.',
    'Carta de aceptación de bases'],
  ['escrito_consentimiento', 13, 15, true, CONSENTIMIENTO, 'Escrito de consentimiento']
];

const DOCS_TRIJAEM = [
  ['acta_nacimiento', 1, 15, true,
    'I. Ser ciudadano mexicano en pleno goce de sus derechos civiles y políticos, y tener treinta años cumplidos el día de la designación.',
    'Acta de nacimiento en copia certificada o, en su caso, documento que acredite la nacionalidad mexicana'],
  ['curp', 2, 15, true,
    'II. Estar en pleno goce de sus derechos civiles y políticos.',
    'Clave Única de Registro de Población (CURP)'],
  ['ine', 3, 15, true,
    'III. Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible y en original para su cotejo.',
    'Credencial para votar con fotografía vigente'],
  ['curriculum', 4, 50, true,
    'IV. Contar al momento de su designación con una experiencia de al menos cinco años en el control, manejo o fiscalización de recursos, transparencia y acceso a la información pública y de responsabilidades administrativas.',
    'Currículum vitae firmado por la persona aspirante, donde se especifique su experiencia profesional de al menos cinco años'],
  ['titulo_profesional', 5, 50, true,
    'V. Contar con título profesional relacionado con el control, manejo o fiscalización de recursos, transparencia y acceso a la información pública y de responsabilidades administrativas, expedido por autoridad o institución legalmente facultada para ello.',
    'Título profesional en copia legible y en original para su cotejo'],
  ['informe_no_penales', 6, 15, true,
    'VI. Gozar de buena reputación.',
    'Informe de no antecedentes penales'],
  ['carta_protesta', 7, 15, true,
    'VII. Carta bajo protesta de decir verdad en donde manifieste: a) No pertenecer o haber pertenecido en los tres años anteriores a su designación, a despachos de consultoría o auditoría que hubieren prestado sus servicios al Tribunal de Justicia Administrativa, o haber fungido como consultor o auditor externo del Tribunal. b) No estar suspendido por resolución firme como servidor público. c) Gozar de buena reputación. d) No haber sido Secretario de Estado, Fiscal General de Justicia, Diputado, miembro de la Junta de Gobierno y Administración, responsable del manejo de los recursos públicos de algún partido político, ni haber sido postulado para cargo de elección popular en los tres años anteriores a la propia designación.',
    'Carta bajo protesta de decir verdad'],
  ['certificado_no_deudor', 8, 15, true,
    'VIII. Certificado de No Deudor Alimentario, expedido por el Registro Nacional de Obligaciones Alimentarias.',
    'Certificado de No Deudor Alimentario'],
  ['carta_solicitud_inscripcion', 9, 15, true,
    'IX. Carta de solicitud de inscripción con firma autógrafa en donde se manifieste su intención de participar en el proceso de designación y de aceptar las disposiciones del mismo.',
    'Carta de solicitud de inscripción'],
  ['carta_motivos', 10, 15, true,
    'X. Exposición de motivos de su aspiración.',
    'Exposición de motivos'],
  ['carta_aceptacion_bases', 11, 15, true,
    'XI. Carta con firma autógrafa en la que manifieste la aceptación de las bases, procedimientos, deliberaciones y resoluciones de la presente convocatoria.',
    'Carta de aceptación de bases'],
  ['escrito_consentimiento', 12, 15, true, CONSENTIMIENTO, 'Escrito de consentimiento']
];

async function idDeConvocatoria(queryInterface, slug) {
  const [[fila]] = await queryInterface.sequelize.query(
    'SELECT id FROM convocatorias WHERE slug = :slug LIMIT 1',
    { replacements: { slug } }
  );
  if (!fila) {
    throw new Error(`No existe la convocatoria "${slug}". Ejecuta primero las migraciones.`);
  }
  return fila.id;
}

function aRenglones(docs, convocatoriaId, ahora) {
  return docs.map(([valor, orden, maxMb, obligatorio, requisito, documento]) => ({
    convocatoria_id: convocatoriaId,
    valor,
    valor_real: requisito,
    documento_requerido: documento,
    orden,
    obligatorio,
    max_mb: maxMb,
    createdAt: ahora,
    updatedAt: ahora
  }));
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const ahora = new Date();
    const teem = await idDeConvocatoria(queryInterface, 'contraloria-teem');
    const trijaem = await idDeConvocatoria(queryInterface, 'oic-trijaem');

    const [existentes] = await queryInterface.sequelize.query(
      'SELECT id FROM tipodocumentos WHERE convocatoria_id IN (:ids) LIMIT 1',
      { replacements: { ids: [teem, trijaem] } }
    );
    if (existentes.length > 0) {
      return;
    }

    await queryInterface.bulkInsert('tipodocumentos', [
      ...aRenglones(DOCS_TEEM, teem, ahora),
      ...aRenglones(DOCS_TRIJAEM, trijaem, ahora)
    ]);
  },

  async down(queryInterface, Sequelize) {
    const teem = await idDeConvocatoria(queryInterface, 'contraloria-teem');
    const trijaem = await idDeConvocatoria(queryInterface, 'oic-trijaem');
    await queryInterface.bulkDelete('tipodocumentos', {
      convocatoria_id: [teem, trijaem]
    });
  }
};
