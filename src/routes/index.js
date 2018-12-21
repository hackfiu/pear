import { Router } from "express";

import application from "../controllers/application";
import workshop from "../controllers/workshop";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);

/* ------ Workshop Routes ------ */
apiRouter.post("/workshop", workshop.create);

export { apiRouter };
