import { Router } from "express";
import { getDocumentos, saveDocumentos, envSolicitud, deleteDoc } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();
router.post("/api/documentos/create/:usuarioId", upload.single('archivo'), saveDocumentos); 
router.get("/api/documentos/getdocumentos/:id", getDocumentos)
router.post("/api/documentos/envestatus/:id", envSolicitud)
router.post("/api/documentos/deleted", deleteDoc)

export default router 