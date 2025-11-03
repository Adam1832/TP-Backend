export class Attack {
    private usageCounter: number = 0;

    constructor(
        public name: string,
        public damage: number,
        public usageLimit: number
    ) {}

    /**
     * Tente d'utiliser l'attaque. Incrémente le compteur si possible.
     * @returns Les dégâts effectifs (0 si plus d'usages).
     */
    public attemptUse(): number {
        if (this.usageCounter < this.usageLimit) {
            this.usageCounter++;
            return this.damage;
        }
        return 0;
    }


    public resetUsage(): void {
        this.usageCounter = 0;
    }

    public displayInfo(): string {
        return `${this.name} | Dégâts: ${this.damage} | Usages restants: ${this.usageLimit - this.usageCounter}/${this.usageLimit}`;
    }

    public get isAvailable(): boolean {
        return this.usageCounter < this.usageLimit;
    }
}