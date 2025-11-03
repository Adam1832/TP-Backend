import { Pokemon } from '../models/Pokemon';
import { Trainer } from '../models/Trainer';

interface BattleResult {
    winner: Trainer | null;
    log: string;
}

export class BattleService {

    /**
     * Logique interne pour simuler un combat Pokémon simple (1v1) jusqu'à KO.
     * @returns Le Pokémon vainqueur.
     */
    private static simulateSingleBattle(p1: Pokemon, p2: Pokemon): Pokemon | null {
        let attacker = p1;
        let defender = p2;
        
        while (!p1.isFainted && !p2.isFainted) {
            const damage = attacker.attack(defender);
            if (damage > 0) {
                 // Échange de rôles seulement si une attaque a été lancée
                [attacker, defender] = [defender, attacker];
            } else {
                // Si aucune attaque disponible, l'attaquant perd son tour
                [attacker, defender] = [defender, attacker]; 
            }
        }
        return p1.isFainted ? p2 : (p2.isFainted ? p1 : null);
    }

    // --- Méthodes de combat exposées pour l'API ---

    /**
     * Défi aléatoire : Soin, choix aléatoire, combat simple.
     */
    public static randomChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult {
        let log = "";
        
        // Soin des Pokémon avant le combat (Taverne)
        trainer1.healAllPokemons();
        trainer2.healAllPokemons();
        log += `[INFO] ${trainer1.name} et ${trainer2.name} soignent leurs équipes.\n`;

        const p1 = trainer1.getRandomActivePokemon();
        const p2 = trainer2.getRandomActivePokemon();

        if (!p1 || !p2) {
            return { winner: null, log: "Erreur: Un dresseur n'a pas de Pokémon actif pour combattre." };
        }

        log += `\n🚀 Défi Aléatoire : ${trainer1.name} (${p1.name}) vs ${trainer2.name} (${p2.name}) 🚀\n`;
        
        const winnerPokemon = this.simulateSingleBattle(p1, p2);
        
        const winnerTrainer = winnerPokemon === p1 ? trainer1 : (winnerPokemon === p2 ? trainer2 : null);

        if (winnerTrainer) {
            winnerTrainer.gainExperience(5);
            log += `\n🏆 Vainqueur : ${winnerTrainer.name}! Il gagne 5 XP. (Niv: ${winnerTrainer.level})`;
        } else {
             log += `\nRésultat indéterminé.`;
        }

        return { winner: winnerTrainer, log: log };
    }

    /**
     * Défi déterministe : Choix du Pokémon avec le plus de PV, pas de soin.
     */
    public static deterministicChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult {
        let log = "";

        // Pas de Taverne/Soin ici
        const p1 = trainer1.getPokemonWithMostLife();
        const p2 = trainer2.getPokemonWithMostLife();

        if (!p1 || !p2) {
            return { winner: null, log: "Erreur: Un dresseur n'a pas de Pokémon actifs pour combattre." };
        }

        log += `\n⚔️ Défi Déterministe : ${trainer1.name} choisit ${p1.name} (${p1.lifePoint} PV) vs ${trainer2.name} choisit ${p2.name} (${p2.lifePoint} PV) ⚔️\n`;

        const winnerPokemon = this.simulateSingleBattle(p1, p2);
        
        const winnerTrainer = winnerPokemon === p1 ? trainer1 : (winnerPokemon === p2 ? trainer2 : null);

        if (winnerTrainer) {
            winnerTrainer.gainExperience(3);
            log += `\n🏆 Vainqueur : ${winnerTrainer.name}! Il gagne 3 XP.`;
        } else {
             log += `\nRésultat indéterminé.`;
        }

        return { winner: winnerTrainer, log: log };
    }

    /**
     * Arène 1 : 100 combats aléatoires successifs. Le meilleur niveau/XP gagne.
     * (Simule 100 combats simples de type randomChallenge)
     */
    public static arena1(trainer1: Trainer, trainer2: Trainer): BattleResult {
        let t1Wins = 0;
        let t2Wins = 0;
        
        for (let i = 0; i < 100; i++) {
            // Note: On utilise la logique de base du défi aléatoire sans réenregistrer l'XP pour chaque micro-combat
            trainer1.healAllPokemons();
            trainer2.healAllPokemons();
            const p1 = trainer1.getRandomActivePokemon();
            const p2 = trainer2.getRandomActivePokemon();
            
            if (!p1 || !p2) continue; // Skip si l'un n'a plus d'actifs

            // Cloner les Pokémon pour simuler sans affecter l'état réel de l'équipe
            const p1Clone = new Pokemon(p1.name, p1.maxLifePoint, p1.attacks.map(a => new Attack(a.name, a.damage, a.usageLimit)));
            const p2Clone = new Pokemon(p2.name, p2.maxLifePoint, p2.attacks.map(a => new Attack(a.name, a.damage, a.usageLimit)));

            const winnerPokemon = this.simulateSingleBattle(p1Clone, p2Clone);

            if (winnerPokemon === p1Clone) {
                t1Wins++;
            } else if (winnerPokemon === p2Clone) {
                t2Wins++;
            }
        }
        
        // Mettre à jour l'XP après le tournoi
        trainer1.gainExperience(t1Wins / 20); // Gain d'XP proportionnel aux victoires
        trainer2.gainExperience(t2Wins / 20);

        let log = `\n🏟️ Arène 1 - 100 Combats Aléatoires 🏟️\n`;
        log += `${trainer1.name} : ${t1Wins} victoires.\n`;
        log += `${trainer2.name} : ${t2Wins} victoires.\n`;

        let winnerTrainer: Trainer | null = null;
        if (t1Wins > t2Wins) {
            winnerTrainer = trainer1;
        } else if (t2Wins > t1Wins) {
            winnerTrainer = trainer2;
        } else {
            // En cas d'égalité, le niveau (ou XP) départage
            if (trainer1.level > trainer2.level || (trainer1.level === trainer2.level && trainer1.experience > trainer2.experience)) {
                winnerTrainer = trainer1;
            } else if (trainer2.level > trainer1.level || (trainer2.level === trainer1.level && trainer2.experience > trainer1.experience)) {
                winnerTrainer = trainer2;
            }
        }

        if (winnerTrainer) {
            log += `\n🏆 Vainqueur de l'Arène (score ou niveau/XP) : ${winnerTrainer.name}!`;
        } else {
            log += `\nRésultat : Égalité parfaite.`;
        }

        return { winner: winnerTrainer, log: log };
    }
}