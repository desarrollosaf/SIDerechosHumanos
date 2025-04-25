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
exports.getMovimientos = exports.ReadServidor = void 0;
const servidor_1 = require("../models/servidor");
const moment_1 = __importDefault(require("moment"));
const dependencia_1 = require("./../models/dependencia");
const direccion_1 = require("./../models/direccion");
const declaraciones_1 = require("./../models/declaraciones");
const ReadServidor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listServidor = yield servidor_1.Servidor.findAll({
        include: [
            {
                model: dependencia_1.Dependencia,
                as: 'dependencia'
            },
            {
                model: direccion_1.Direccion,
                as: 'direccion'
            }
        ]
    });
    res.json(listServidor);
});
exports.ReadServidor = ReadServidor;
const getMovimientos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const fechaActual = (0, moment_1.default)();
    const servidor = yield servidor_1.Servidor.findOne({ where: { id: id },
        include: [
            {
                model: dependencia_1.Dependencia,
                as: 'dependencia'
            },
            {
                model: direccion_1.Direccion,
                as: 'direccion'
            }
        ]
    });
    const declaraciones = yield declaraciones_1.Declaraciones.findAll({
        where: { servidor_publico_id: id }, // Relacionar por el ID de servidor
    });
    declaraciones.map((d) => {
        const data = d.dataValues;
        const fechaDeclaracion = (0, moment_1.default)(data.fecha_declaracion);
        const fechaMaxima = fechaDeclaracion.clone().add(60, 'days');
        let fechaMaximaModificacion;
        if (fechaDeclaracion.year() === 2021) {
            fechaMaximaModificacion = fechaDeclaracion.clone().add(91, 'days');
        }
        else {
            fechaMaximaModificacion = fechaDeclaracion.clone().add(30, 'days');
        }
        if (!data.fecha_envio) {
            if (data.tipo_movimiento_id !== 3) {
                data.estatusEnvio = fechaMaxima.isBefore(fechaActual) ? 'OMISO' : 'EN TIEMPO';
            }
            else {
                data.estatusEnvio = fechaMaximaModificacion.isBefore(fechaActual) ? 'OMISO' : 'EN TIEMPO';
            }
        }
        else {
            const fechaEnvio = (0, moment_1.default)(data.fecha_envio);
            if (data.tipo_movimiento_id !== 3) {
                data.estatusEnvio = fechaEnvio.isAfter(fechaMaxima) ? 'ENVIO EXTEMPORANEO' : 'ENVIO EN TIEMPO';
            }
            else {
                data.estatusEnvio = fechaEnvio.isAfter(fechaMaximaModificacion) ? 'ENVIO EXTEMPORANEO' : 'ENVIO EN TIEMPO';
            }
        }
        if (data.obligado) {
            data.estatus = 'OBLIGADO';
        }
        else if (data.motivo_no_obligado_id) {
            data.estatus = 'NO OBLIGADO - ';
        }
        else {
            data.estatus = 'NO OBLIGADO';
        }
        return data;
    });
    const servidorConDeclaraciones = {
        servidor,
        declaraciones
    };
    console.log(declaraciones);
    res.json(servidorConDeclaraciones);
});
exports.getMovimientos = getMovimientos;
