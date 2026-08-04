import { Request, Response } from 'express';
import Convocatoria from '../models/convocatoria';
import TipoDocumentos from '../models/tipodocumentos';

/** Datos públicos de una convocatoria, con o sin su lista de documentos. */
const aJson = (convocatoria: Convocatoria, incluirDocumentos = false) => {
  const base = {
    id: convocatoria.id,
    slug: convocatoria.slug,
    nombre: convocatoria.nombre,
    titulo: convocatoria.titulo,
    organismo: convocatoria.organismo,
    aviso_privacidad_url: convocatoria.aviso_privacidad_url,
    sede: convocatoria.sede,
    periodo_texto: convocatoria.periodo_texto,
    fecha_inicio: convocatoria.fecha_inicio,
    fecha_fin: convocatoria.fecha_fin,
    activa: convocatoria.activa,
    abierta: convocatoria.estaAbierta(),
  };

  if (!incluirDocumentos) {
    return base;
  }

  return {
    ...base,
    tipos_documento: (convocatoria.tipos_documento ?? []).map((tipo) => ({
      id: tipo.id,
      valor: tipo.valor,
      requisito: tipo.valor_real,
      documento_requerido: tipo.documento_requerido,
      orden: tipo.orden,
      obligatorio: tipo.obligatorio,
      max_mb: tipo.max_mb,
    })),
  };
};

/** Convocatorias activas, para el listado público. */
export const getConvocatorias = async (req: Request, res: Response): Promise<any> => {
  const convocatorias = await Convocatoria.findAll({
    where: { activa: true },
    order: [['id', 'ASC']],
  });

  return res.json({
    msg: 'Listado exitoso',
    data: convocatorias.map((c) => aJson(c)),
  });
};

/** Todas las convocatorias, incluidas las cerradas (uso administrativo). */
export const getTodasConvocatorias = async (req: Request, res: Response): Promise<any> => {
  const convocatorias = await Convocatoria.findAll({ order: [['id', 'ASC']] });

  return res.json({
    msg: 'Listado exitoso',
    data: convocatorias.map((c) => aJson(c)),
  });
};

/** Detalle de una convocatoria con sus requisitos y documentos. */
export const getConvocatoria = async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;

  const convocatoria = await Convocatoria.findOne({
    where: { slug },
    include: [
      {
        model: TipoDocumentos,
        as: 'tipos_documento',
      },
    ],
    order: [[{ model: TipoDocumentos, as: 'tipos_documento' }, 'orden', 'ASC']],
  });

  if (!convocatoria) {
    return res.status(404).json({ msg: `No existe la convocatoria ${slug}` });
  }

  return res.json(aJson(convocatoria, true));
};
