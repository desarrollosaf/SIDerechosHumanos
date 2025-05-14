import { Router } from "express";
import { getDocumentos, saveDocumentos, envSolicitud } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();
router.post("/api/documentos/create/:usuarioId", upload.single('archivo'), saveDocumentos); 
router.get("/api/documentos/getdocumentos/:id", getDocumentos)
router.get("/api/documentos/envestatus/:id", envSolicitud)

export default router 