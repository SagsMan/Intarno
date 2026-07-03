import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import customersRouter from "./customers";
import inquiriesRouter from "./inquiries";
import ordersRouter from "./orders";
import projectsRouter from "./projects";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/customers", customersRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/orders", ordersRouter);
router.use("/projects", projectsRouter);
router.use("/stats", statsRouter);

export default router;
