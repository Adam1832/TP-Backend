import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';

// Structures de stockage
export const trainers: Trainer[] = [];

// Création des données initiales pour le test
const attackFire = new Attack("Flammèche", 15, 5);
const attackNormal = new Attack("Charge", 10, 10);
const attackGrass = new Attack("Fouet Liane", 20, 3);
const attackWater = new Attack("Pistolet à O", 12, 8);

const pika = new Pokemon("Pikachu", 50);
pika.learnAttack(attackFire);
pika.learnAttack(attackNormal);

const bulb = new Pokemon("Bulbizarre", 60);
bulb.learnAttack(attackGrass);
bulb.learnAttack(attackWater);

const trainerSacha = new Trainer("Sacha");
trainerSacha.addPokemon(pika);
trainers.push(trainerSacha);

const trainerOndine = new Trainer("Ondine");
trainerOndine.addPokemon(bulb);
trainers.push(trainerOndine);

/**
 * Fonction de recherche pour les contrôleurs.
 */
export function getTrainerByName(name: string): Trainer | undefined {
    return trainers.find(t => t.name.toLowerCase() === name.toLowerCase());
}