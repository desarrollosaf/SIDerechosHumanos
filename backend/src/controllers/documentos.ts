import { Request, Response, NextFunction } from 'express'
import Solicitudes  from '../models/solicitud';
import Documentos  from '../models/documentos';
import TipoDocumentos  from '../models/tipodocumentos';
import fs from 'fs';
import path from 'path';
import RolUsers from '../models/role_users';
import ValidadorSolicitud from '../models/validadorsolicitud';
import User from '../models/user';   
import DatosUser from '../models/datos_user'; 
import { sendEmail } from '../utils/mailer';
import DetalleFecha from '../models/detalle_fecha';


export const saveDocumentos = async (req: Request, res: Response): Promise<any> => {
    const archivo = req.file; 
    const { tipo, usuario } = req.body;

  
    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no recibido' });
    }

    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] 
            }
        ]
    });
    let documentoGuardado;
    const tipo1 = await TipoDocumentos.findOne({
        where: { valor: tipo } 
    });
    if (!tipo1) {
        return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }
    if (documentoExistente) {
        const documentoPath = path.resolve(documentoExistente.path);
        if(documentoExistente.path != ''){
          if (fs.existsSync(documentoPath)) {
            fs.unlinkSync(documentoPath);
          }
        }
        documentoExistente.path = `storage/${usuario}/${archivo.filename}`;
         documentoExistente.estatus = 1;
        await documentoExistente.save();


        documentoGuardado = documentoExistente;
    } else {
        
        
        documentoGuardado = await Documentos.create({
            solicitudId: solicitud.id,
            path: `storage/${usuario}/${archivo.filename}`,
            tipoDocumento: tipo1.id, 
            estatus: 1
        });
    }

    return res.status(201).json({
        message: 'Documento guardado exitosamente',
        documento: documentoGuardado
    });
};

export const getDocumentos = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const solicitudConDocumentos = await Solicitudes.findOne({
      where: { userId: id },
      include: [
        {
          model: Documentos,
          as: 'documentos',
          include: [
            {
              model: TipoDocumentos,
              as: 'tipo',
              attributes: ['valor'],
            },
          ],
        },
        {
          model: ValidadorSolicitud,
          as: 'validasolicitud',
          include: [
            {
              model: User,
              as: 'validador',
              include: [
                {
                  model: DatosUser,
                  as: 'datos_user',
                }
              ]
            },
          ],
        },
      ],
      logging: console.log,
    });

    if(solicitudConDocumentos){
        return res.json(solicitudConDocumentos)
    }else{
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
};

export const envSolicitud = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const solicitud: any = await Solicitudes.findOne({ where: { userId: id } });

    if (!solicitud) {
        return res.status(404).json({ msg: `No existe el id ${id}` });
    }

    const validadores: any[] = await RolUsers.findAll({ where: { role_id: 2 } });
    if (validadores.length === 0) {
        return res.status(400).json({ msg: "No hay validadores disponibles" });
    }

    const validadorConMenosSolicitudes = await Promise.all(
        validadores.map(async (validador) => {
        const count = await ValidadorSolicitud.count({ where: { validadorId: validador.user_id } });
        return { validador, count };
        })
    ).then((results) => results.sort((a, b) => a.count - b.count)[0].validador);
   
    
    const existsolicitud: any = await ValidadorSolicitud.findOne({ where: { solicitudId: solicitud.id } });
    if(!existsolicitud){
      await ValidadorSolicitud.create({
          solicitudId: solicitud.id,
          validadorId: validadorConMenosSolicitudes.user_id,
      });
    }
    

    solicitud.estatusId = 2;
    solicitud.fecha_envio = new Date();
    await solicitud.save();
    return res.json("200");
};

export const deleteDoc = async (req: Request, res: Response): Promise<any> => {
    const { tipo, usuario } = req.body;
    
    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] 
            }
        ]
    });

    if(documentoExistente){
        const documentoPath = path.resolve(documentoExistente.path);
        if (fs.existsSync(documentoPath)) {
            fs.unlinkSync(documentoPath);
        }
      const existsolicitud: any = await ValidadorSolicitud.findOne({ where:
         { solicitudId: solicitud.id } });
      
      if(existsolicitud){
        documentoExistente.path = '';
        await documentoExistente.save();
      }else{
        await Documentos.destroy({
          where: {
            tipoDocumento: documentoExistente.tipoDocumento  
          }
        });
      }
      
      return res.json('200')
    }else{
      return res.status(404).json({
            msg: `No existe el documento con el tipo y solicitud${usuario}`,
        });
    }
}


export const estatusDoc = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const Documentos2 = req.body;

    const solicitud = await Solicitudes.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['email'],
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const documentosExistentes = await Documentos.findAll({
      where: { solicitudId: solicitud.id },
      include: [{ model: TipoDocumentos, as: 'tipo' }]
    });

    const observados: { tipo: string; observaciones: string }[] = [];

    for (const documentoExistente of documentosExistentes) {
      const tipo1 = documentoExistente.tipo as TipoDocumentos;
      const tipoValor = tipo1?.valor;
      const doc = tipo1?.valor_real;
      const documentoEntrada = Documentos2.find((doc: any) => doc.nombre === tipoValor);

      if (documentoEntrada && tipoValor) {
        documentoExistente.estatus = 3;
        documentoExistente.observaciones = documentoEntrada.observaciones || '';
        observados.push({ tipo: doc ?? '', observaciones: documentoEntrada.observaciones || '' });
      } else {
        documentoExistente.estatus = 2;
      }

      await documentoExistente.save();
    }

    // Actualiza estatus
    if(observados.length > 0){
      await DetalleFecha.create({
          solicitud_id: solicitud.id,
          fecha: new Date(),
      });
    }else{
      solicitud.fecha_validacion = new Date();
    }
    solicitud.estatusId = observados.length > 0 ? 4 : 3;
    await solicitud.save();

    // ENVÍO ASÍNCRONO DEL CORREO
    const usuario = (solicitud as any).usuario;
    const emailDestino = usuario?.email;

    if (emailDestino) {
      // Ejecuta sin bloquear
      (async () => {
        try {
          let htmlContent: string;

          if (observados.length > 0) {
            const tablaObservados = `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
                <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="text-align: left;">Documento</th>
                    <th style="text-align: left;">Observación</th>
                </tr>
                </thead>
                <tbody>
                ${observados.map(o => `
                    <tr>
                    <td>${o.tipo}</td>
                    <td>${o.observaciones}</td>
                    </tr>
                `).join('')}

                </tbody>
            </table>`;
             const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            const hoy = new Date();
            const fechaFormateada = `Toluca de Lerdo, México; a ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}.`;

            const contenido = `
              <div class="container">
              <h1>OBSERVACIONES</h1>
              <p  class="pderecha" >${fechaFormateada}</p>
              <h3><trong>C.</strong> ${solicitud.nombres} ${solicitud.ap_paterno} ${solicitud.ap_materno},</h3>
              <p><strong>Folio:</strong> ${solicitud.id.slice(0, 8)}</p>
              <p>Por este medio se le informa que, tras la revisión realizada en el portal
               de registro respecto de su solicitud, se ha determinado que el registro es NO PROCEDENTE. <br>
               
               A continuación, se detallan las observaciones encontradas:</p>
               ${tablaObservados}
               <p>Es importante mencionarle que puede subsanar dichas observaciones en un plazo no mayor
                a XXXX horas naturales contadas a partir de la recepción de este correo.
                En caso de no realizarlo en dicho plazo, se considerará no cumplimentada
                la acreditación de los requisitos de elegibilidad. <br><br>
                
                Para estos efectos, se habilitará la sección correspondiente en la página de
                registro para que pueda cargar los documentos requeridos. Dichos campos estarán
                disponibles solo durante doce horas, y posterior a ese tiempo,
                se cerrarán nuevamente, sin posibilidad de modificación. <br><br>

                Para enviar la documentación corregida, por favor, ingrese
                a la cuenta registrada y diríjase al campo de documentación,
                en donde podrá sustituir el archivo correspondiente. <br><br>
                
                Agradecemos su pronta atención a este asunto. Si tiene alguna duda o requiere asistencia
                adicional, no dude en ponerse en contacto con nosotros.</p>
                <p>Atentamente,<br><strong>Poder Legislativo del Estado de México</strong></p>
              </div>
            `;

            htmlContent = generarHtmlCorreo(contenido);

             await sendEmail(
                emailDestino,
                'Revisión de documentos',
                htmlContent
              );
          }
           
        } catch (correoError) {
          console.error('Error al enviar correo:', correoError);
        }
      })();
    } else {
      console.warn('No se encontró email del usuario');
    }

    // Respondemos al cliente sin esperar el correo
    return res.status(200).json({ message: 'Documentos actualizados correctamente.' });

  } catch (error) {
    console.error('Error al actualizar documentos:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

function generarHtmlCorreo(contenidoHtml: string): string {
  return `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          p {
            color: #4d4d4d;
            font-size: 16px;
            line-height: 1.5;
          }
          .credentials {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 30px;
            text-align: center;
          }
          .pderecha{
          text-align: right;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img 
            src="https://congresoedomex.gob.mx/storage/images/congreso.jpg" 
            alt="Logo"
            style="display: block; margin: 0 auto; width: 300px; height: auto;"
          >
        </div>
        <div class="content">
          ${contenidoHtml}
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} SIDerechosHumanos. Todos los derechos reservados.
        </div>
      </body>
    </html>
  `;
}


