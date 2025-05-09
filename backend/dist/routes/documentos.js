"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentos_1 = require("../controllers/documentos");
const multer_1 = require("../controllers/multer");
const router = (0, express_1.Router)();

router.post("/api/documentos/create/:usuarioId", multer_1.upload.single('archivo'), documentos_1.saveDocumentos);

exports.default = router;
