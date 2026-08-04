"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvocatoria = exports.getTodasConvocatorias = exports.getConvocatorias = void 0;
const convocatoria_1 = __importDefault(require("../models/convocatoria"));
const tipodocumentos_1 = __importDefault(require("../models/tipodocumentos"));
/** Datos públicos de una convocatoria, con o sin su lista de documentos. */
const aJson = (convocatoria, incluirDocumentos = false) => {
    var _a;
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
    return Object.assign(Object.assign({}, base), { tipos_documento: ((_a = convocatoria.tipos_documento) !== null && _a !== void 0 ? _a : []).map((tipo) => ({
            id: tipo.id,
            valor: tipo.valor,
            requisito: tipo.valor_real,
            documento_requerido: tipo.documento_requerido,
            orden: tipo.orden,
            obligatorio: tipo.obligatorio,
            max_mb: tipo.max_mb,
        })) });
};
/** Convocatorias activas, para el listado público. */
const getConvocatorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const convocatorias = yield convocatoria_1.default.findAll({
        where: { activa: true },
        order: [['id', 'ASC']],
    });
    return res.json({
        msg: 'Listado exitoso',
        data: convocatorias.map((c) => aJson(c)),
    });
});
exports.getConvocatorias = getConvocatorias;
/** Todas las convocatorias, incluidas las cerradas (uso administrativo). */
const getTodasConvocatorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const convocatorias = yield convocatoria_1.default.findAll({ order: [['id', 'ASC']] });
    return res.json({
        msg: 'Listado exitoso',
        data: convocatorias.map((c) => aJson(c)),
    });
});
exports.getTodasConvocatorias = getTodasConvocatorias;
/** Detalle de una convocatoria con sus requisitos y documentos. */
const getConvocatoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const convocatoria = yield convocatoria_1.default.findOne({
        where: { slug },
        include: [
            {
                model: tipodocumentos_1.default,
                as: 'tipos_documento',
            },
        ],
        order: [[{ model: tipodocumentos_1.default, as: 'tipos_documento' }, 'orden', 'ASC']],
    });
    if (!convocatoria) {
        return res.status(404).json({ msg: `No existe la convocatoria ${slug}` });
    }
    return res.json(aJson(convocatoria, true));
});
exports.getConvocatoria = getConvocatoria;
