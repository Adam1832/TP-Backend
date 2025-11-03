import { Request, Response } from 'express';
import { BattleService } from '../services/BattleService';
import { getTrainerByName } from '../storage/DatabaseSimulation';

export class BattleController {

    /**
     * [POST] /api/battle/random
     * Gère le 'Défi aléatoire'.
     */
    public static handleRandomChallenge(req: Request, res: Response): void {
        const { trainer1Name, trainer2Name } = req.body;

        const trainer1 = getTrainerByName(trainer1Name);
        const trainer2 = getTrainerByName(trainer2Name);

        if (!trainer1 || !trainer2) {
            res.status(404).json({ error: "Un ou plusieurs dresseurs sont introuvables." });
            return;
        }

        // Appel du service métier
        const result = BattleService.randomChallenge(trainer1, trainer2);

        res.status(200).json({
            status: "Défi terminé",
            winner: result.winner ? result.winner.name : "Match nul / Erreur",
            log: result.log,
            currentStatus: {
                trainer1: { name: trainer1.name, level: trainer1.level, experience: trainer1.experience },
                trainer2: { name: trainer2.name, level: trainer2.level, experience: trainer2.experience },
            }
        });
    }

    /**
     * [POST] /api/battle/deterministic
     * Gère le 'Défi déterministe'.
     */
    public static handleDeterministicChallenge(req: Request, res: Response): void {
        const { trainer1Name, trainer2Name } = req.body;

        const trainer1 = getTrainerByName(trainer1Name);
        const trainer2 = getTrainerByName(trainer2Name);

        if (!trainer1 || !trainer2) {
            res.status(404).json({ error: "Un ou plusieurs dresseurs sont introuvables." });
            return;
        }

        // Appel du service métier
        const result = BattleService.deterministicChallenge(trainer1, trainer2);

        res.status(200).json({
            status: "Défi déterministe terminé",
            winner: result.winner ? result.winner.name : "Match nul / Erreur",
            log: result.log,
        });
    }

    /**
     * [POST] /api/battle/arena1
     * Gère l''Arène 1'.
     */
    public static handleArena1(req: Request, res: Response): void {
        const { trainer1Name, trainer2Name } = req.body;

        const trainer1 = getTrainerByName(trainer1Name);
        const trainer2 = getTrainerByName(trainer2Name);

        if (!trainer1 || !trainer2) {
            res.status(404).json({ error: "Un ou plusieurs dresseurs sont introuvables." });
            return;
        }

        // Appel du service métier
        const result = BattleService.arena1(trainer1, trainer2);

        res.status(200).json({
            status: "Arène 1 terminée",
            winner: result.winner ? result.winner.name : "Match nul / Égalité",
            log: result.log,
            finalStatus: {
                trainer1: { name: trainer1.name, level: trainer1.level, experience: trainer1.experience },
                trainer2: { name: trainer2.name, level: trainer2.level, experience: trainer2.experience },
            }
        });
    }
}