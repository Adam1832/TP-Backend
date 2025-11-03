import { Pokemon } from './Pokemon';

export class Trainer {
    private static readonly EXP_TO_LEVEL_UP: number = 10;
    private currentLevel: number = 1;

    constructor(
        public name: string,
        private currentExperience: number = 0,
        public pokemons: Pokemon[] = []
    ) {
        this.updateLevel();
    }

    public addPokemon(pokemon: Pokemon): void {
        this.pokemons.push(pokemon);
    }

    /**
     * Effectue un soin complet de tous les Pokémon de l'équipe (taverne).
     */
    public healAllPokemons(): void {
        this.pokemons.forEach(pokemon => pokemon.heal());
    }

    /**
     * Ajoute de l'expérience et gère l'évolution de niveau.
     */
    public gainExperience(amount: number): void {
        this.currentExperience += amount;
        this.updateLevel();
    }

    private updateLevel(): void {
        const previousLevel = this.currentLevel;
        this.currentLevel = Math.floor(this.currentExperience / Trainer.EXP_TO_LEVEL_UP) + 1;

        if (this.currentLevel > previousLevel) {
            console.log(`[LEVEL UP] ${this.name} atteint le niveau ${this.currentLevel}.`);
        }
    }

    /**
     * Trouve le Pokémon actif (non K.O.) avec le plus de PV.
     */
    public getPokemonWithMostLife(): Pokemon | undefined {
        return this.pokemons
            .filter(p => !p.isFainted)
            .sort((a, b) => b.lifePoint - a.lifePoint)[0];
    }

    /**
     * Sélectionne un Pokémon actif de manière aléatoire.
     */
    public getRandomActivePokemon(): Pokemon | undefined {
        const activePokemons = this.pokemons.filter(p => !p.isFainted);
        if (activePokemons.length === 0) return undefined;
        const randomIndex = Math.floor(Math.random() * activePokemons.length);
        return activePokemons[randomIndex];
    }

    public get level(): number {
        return this.currentLevel;
    }

    public get experience(): number {
        return this.currentExperience;
    }

    public get isTeamFainted(): boolean {
        return this.pokemons.every(p => p.isFainted);
    }
}