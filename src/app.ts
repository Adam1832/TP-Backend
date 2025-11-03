import express, { Application, Request, Response } from 'express';
import battleRoutes from './routes/battleRoutes';
import { initializeDatabase } from './config/database'; // Import du placeholder de connexion DB
import { trainers } from './storage/DatabaseSimulation'; // Import des données simulées

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// --- Routes d'information ---
app.get('/trainers', (req: Request, res: Response) => {
    // Affichage des informations sur les dresseurs (état actuel)
    res.json(trainers.map(t => ({
        name: t.name,
        level: t.level,
        experience: t.experience,
        pokemons: t.pokemons.map(p => ({
            name: p.name,
            hp: p.lifePoint,
            maxHp: p.maxLifePoint,
            isFainted: p.isFainted
        }))
    })));
});

// --- Routes des fonctionnalités métier ---
app.use('/api/battle', battleRoutes);

// --- Démarrage du serveur ---
async function startServer() {
    try {
        // En environnement réel, ceci établirait la connexion DB
        await initializeDatabase(); 

        app.listen(PORT, () => {
            console.log(`[SERVER] API Pokémon en cours d'exécution sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("[ERROR] Échec du démarrage du serveur ou de la connexion DB:", error);
        process.exit(1);
    }
}

startServer();