// src/config/database.ts

// import { createConnection } from 'typeorm'; 

/**
 * Fonction pour initialiser la connexion à la base de données PostgreSQL.
 * Dans cette implémentation, elle est remplacée par la simulation en mémoire.
 */
export async function initializeDatabase(): Promise<void> {
    // console.log("Tentative de connexion à PostgreSQL...");
    // await createConnection({... options de connexion DB ...});
    // console.log("Connexion à PostgreSQL établie.");
    
    // Pour ce projet, nous utilisons la simulation en mémoire.
    console.log("Configuration ORM/PostgreSQL ignorée. Utilisation du stockage en mémoire.");
}