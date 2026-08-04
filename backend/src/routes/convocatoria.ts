import { Router } from "express";
import { getConvocatorias, getTodasConvocatorias, getConvocatoria } from "../controllers/convocatoria";

const router = Router();

router.get("/api/convocatorias", getConvocatorias)
router.get("/api/convocatorias/todas", getTodasConvocatorias)
router.get("/api/convocatorias/:slug", getConvocatoria)

export default router
