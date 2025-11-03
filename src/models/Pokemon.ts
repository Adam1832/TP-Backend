import { Attack } from './Attack';

export class Pokemon {
    private static readonly MAX_ATTACKS: number = 4;
    private currentLifePoint: number;

    constructor(
        public name: string,
        public maxLifePoint: number,
        public attacks: Attack[] = []
    ) {
        this.currentLifePoint = maxLifePoint;
    }

    /**
     * Ajoute une attaque à la liste, en respectant la limite et l'unicité.
     */
    public learnAttack(attack: Attack): boolean {
        if (this.attacks.length >= Pokemon.MAX_ATTACKS) {
            return false;
        }
        if (this.attacks.some(a => a.name === attack.name)) {
            return false;
        }

        this.attacks.push(attack);
        return true;
    }

    /**
     * Restaure intégralement les PV et réinitialise les usages d'attaque.
     */
    public heal(): void {
        this.currentLifePoint = this.maxLifePoint;
        this.attacks.forEach(attack => attack.resetUsage());
    }

    /**
     * Lance une attaque aléatoire disponible sur une cible.
     * @param target Le Pokémon ciblé.
     * @returns Les dégâts infligés.
     */
    public attack(target: Pokemon): number {
        const availableAttacks = this.attacks.filter(a => a.isAvailable);

        if (availableAttacks.length === 0) {
            return 0;
        }

        const randomIndex = Math.floor(Math.random() * availableAttacks.length);
        const chosenAttack = availableAttacks[randomIndex];

        const damage = chosenAttack.attemptUse();
        target.takeDamage(damage);

        return damage;
    }

    /**
     * Réduit les points de vie du Pokémon.
     */
    public takeDamage(damage: number): void {
        this.currentLifePoint = Math.max(0, this.currentLifePoint - damage);
    }

    public get lifePoint(): number {
        return this.currentLifePoint;
    }

    public get isFainted(): boolean {
        return this.currentLifePoint === 0;
    }
}