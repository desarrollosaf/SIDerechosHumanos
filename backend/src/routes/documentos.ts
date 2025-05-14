import { Router } from "express";
import { getDocumentos, saveDocumentos, envSolicitud, deleteDoc, estatusDoc } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();
router.post("/api/documentos/create/:usuarioId", upload.single('archivo'), saveDocumentos); 
router.get("/api/documentos/getdocumentos/:id", getDocumentos)
router.get("/api/documentos/envestatus/:id", envSolicitud)
router.post("/api/documentos/deleted", deleteDoc)
router.post("/api/documentos/validadoc", estatusDoc)

export default router 