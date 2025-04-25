"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servidores_1 = require("../controllers/servidores");
const router = (0, express_1.Router)();
router.get("/api/servidor/read", servidores_1.ReadServidor);
router.get("/api/servidor/movimientos/:id", servidores_1.getMovimientos);
exports.default = router;
