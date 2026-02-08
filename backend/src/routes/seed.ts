import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { importSeedData, clearSeedData } from '../controllers/seed.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', importSeedData);
router.delete('/', clearSeedData);

export default router;
