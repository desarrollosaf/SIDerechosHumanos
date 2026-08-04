"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const convocatoria_1 = require("../controllers/convocatoria");
const router = (0, express_1.Router)();
router.get("/api/convocatorias", convocatoria_1.getConvocatorias);
router.get("/api/convocatorias/todas", convocatoria_1.getTodasConvocatorias);
router.get("/api/convocatorias/:slug", convocatoria_1.getConvocatoria);
exports.default = router;
