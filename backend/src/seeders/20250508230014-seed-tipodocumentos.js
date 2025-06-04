'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipodocumentos', [
      { valor: 'curp', valor_real: 'Ser mexicano por nacimiento, en pleno goce y ejercicio de sus derechos políticos y civiles.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'ine', valor_real: 'Acreditar residencia efectiva en el territorio del Estado de México por un periodo no menor a cinco años anteriores al día de su elección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'titulo_licenciatura', valor_real: 'Contar preferentemente con título de Licenciatura en Derecho, así como experiencia o estudios en materia de derechos humanos.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'acta_nacimiento', valor_real: 'Tener treinta y cinco años cumplidos al día de la elección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_ant_no_penales', valor_real: 'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada por delito intencional.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta1', valor_real: 'No ser ministro de culto, salvo que se haya separado de dicho ministerio con al menos tres años de anticipación al día de su elección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta2', valor_real: 'No haber desempeñado cargo directivo en partido político, asociación u organización política en los tres años anteriores a la elección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta3', valor_real: 'No haber sido sancionado en el ejercicio de funciones públicas por recomendaciones de organismos públicos de derechos humanos.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta4', valor_real: 'No haber sido objeto de sanción de inhabilitación o destitución administrativas mediante resolución firme.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta5', valor_real: 'Carta firmada en la que la persona aspirante manifieste su voluntad expresa de participar en el proceso de selección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'curriculum', valor_real: 'Currículum vitae con detalle de experiencia laboral, formación académica, especialización y/o publicaciones en materia de derechos humanos.',  createdAt: new Date(), updatedAt: new Date() },
      { valor: 'propuesta_programa', valor_real: 'Propuesta de programa de trabajo y justificación de idoneidad para ocupar el cargo.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'copia_certificada', valor_real: 'Copia certificada de documentos que acrediten nacionalidad, ciudadanía, edad y grado(s) académico(s).', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipodocumentos', null, {});
  }
};
