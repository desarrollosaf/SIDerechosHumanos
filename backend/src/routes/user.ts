import { Router } from "express";
import { CreateUser, LoginUser, ReadUser, getvalidadores, updatevalidador, saveValidador } from "../controllers/user";

const router = Router();

router.get("/api/user/read", ReadUser)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)
router.get("/api/user/getvalidadores", getvalidadores)
router.post("/api/user/updatevalidador", updatevalidador)
router.post("/api/user/savevalidador", saveValidador)


export default router