import { Response, NextFunction } from 'express';
import { seedService } from '../services/seed.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const importSeedData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await seedService.seedData(req.userId!);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const clearSeedData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Ideally we'd only clear data created by this user or tagged as seed data.
        // For now, this service clears EVERYTHING which is dangerous.
        // Let's restrict it or make it safer in a real scenario.
        // For this alpha/demo, we might just want to clear the user's projects/tasks?
        // The current implementation clears GLOBAL data which is bad for multi-tenant.

        // REVISION: Let's only delete data related to the current user's owned projects.
        // But the service implementation above deletes everything. 
        // I should refuse to use the `clearData` as implemented above for a route accessible by any user.

        // Instead, let's implement a user-scoped clear in the service?
        // For now, I'll send a 501 Not Implemented or refine the service.

        // Let's stick to just seeding for now, and maybe a "Reset My Data" which is safer.

        res.status(501).json({ message: 'Clear data not yet safely implemented for web usage' });
    } catch (error) {
        next(error);
    }
};
