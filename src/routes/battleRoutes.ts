import { Router } from 'express';
import { BattleController } from '../controllers/BattleController';

const router = Router();

// Défi aléatoire (avec soin, 1 Pokémon aléatoire)
router.post('/random', BattleController.handleRandomChallenge);

// Défi déterministe (sans soin, 1 Pokémon max PV)
router.post('/deterministic', BattleController.handleDeterministicChallenge);

// Arène 1 (100 combats aléatoires)
router.post('/arena1', BattleController.handleArena1);

export default router;