import type { Todo } from '../app/services/todo.service';
import { generateRandomId } from '../app/utils/functions/id-generator';

const totalNumberOfItems = 86;
export const mockTodos: Todo[] = Array.from({ length: totalNumberOfItems }, (_) => ({
    id: generateRandomId(10),
    label: generateRandomLabels(),
    description: generateRandomDescription(),
    completed: Math.random() < 0.5,
    createdAt: Date.now(),
}));

function generateRandomLabels(): string {
    const firstNames: string[] = [
        'Anna',
        'Bence',
        'Csaba',
        'Dóra',
        'Eszter',
        'Feri',
        'Gábor',
        'Hanna',
        'István',
        'Judit',
        'Kata',
        'László',
        'Márk',
        'Nóra',
        'Olivér',
        'Péter',
        'Rita',
        'Szabolcs',
        'Tamás',
        'Zsófi',
    ];
    const shops: string[] = [
        'Aldi',
        'Lidl',
        'Spar',
        'Tesco',
        'dm',
        'Rossmann',
        'OBI',
        'Decathlon',
        'IKEA',
    ];
    const services: string[] = [
        'áram',
        'gáz',
        'víz',
        'internet',
        'telefon',
        'parkolás',
        'közös költség',
    ];
    const doctors: string[] = ['háziorvos', 'fogorvos', 'bőrgyógyász', 'szemész', 'gyógytornász'];
    const items: string[] = [
        'tej',
        'kenyér',
        'tojás',
        'zabpehely',
        'kávé',
        'mosószer',
        'szemeteszsák',
        'izzó',
        'USB-kábel',
        'jegyzetfüzet',
        'ceruza',
        'bébi törlő',
        'vitamin',
        'macskatáp',
    ];
    const workThings: string[] = [
        'prezentáció vázlat',
        'sprint célok',
        'kódfelülvizsgálat',
        'ticket összegzés',
        'bug reprodukció',
        'deploy terv',
        'meeting jegyzet',
    ];
    const houseChores: string[] = [
        'mosogatás',
        'porszívózás',
        'fürdő takarítás',
        'ablakpucolás',
        'hűtő leolvasztás',
        'ruhák összepakolása',
    ];
    const admin: string[] = [
        'TAJ kártya ügyintézés',
        'lakcímkártya másolat',
        'SZJA igazolás letöltése',
        'banki nyilatkozat',
    ];

    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const capitalizeFirstLetter = (stringValue: string): string =>
        stringValue.charAt(0).toUpperCase() + stringValue.slice(1);

    const templates: Array<() => string> = [
        (): string => `Felhívni ${pick(firstNames)}-t`,
        (): string => `E-mail ${pick(firstNames)}-nak: ${pick(workThings)}`,
        (): string => `Időpontfoglalás ${pick(doctors)}hoz`,
        (): string => `Számla befizetése: ${pick(services)}`,
        (): string => `Vásárlás (${pick(shops)}): ${pick(items)}`,
        (): string => `Heti menü megtervezése`,
        (): string => `Bevásárlólista frissítése`,
        (): string => `Prezentáció véglegesítése - ${pick(workThings)}`,
        (): string => `Meeting egyeztetés ${pick(firstNames)}-val`,
        (): string => `Git PR átnézése: ${pick(workThings)}`,
        (): string => `${capitalizeFirstLetter(pick(houseChores))}`,
        (): string => `Autó: guminyomás ellenőrzés`,
        (): string => `Naptár: jövő heti időpontok rendezése`,
        (): string => `Csomag feladása a postán`,
        (): string => `Fotók feltöltése és rendszerezése`,
        (): string => `Jelszavak frissítése (kritikus fiókok)`,
        (): string => `Költségvetés áttekintése`,
        (): string => `Elintézni: ${pick(admin)}`,
        (): string => `Visszahívás kérés ${pick(firstNames)}-től`,
        (): string => `Jegyek foglalása hétvégére`,
        (): string => `Házi doksi: ${pick(workThings)}`,
        (): string => `Szerviz időpont egyeztetés`,
        (): string => `Növények megöntözése`,
        (): string => `Fiók leiratkozások rendbetétele`,
    ];

    const baseLabel: string = pick(templates)();
    if (Math.random() < 0.5) {
        const context = [
            'ma délelőtt',
            'munka után',
            'online',
            'személyesen',
            'sürgős',
            'ezen a héten',
            'holnap reggel',
        ];
        return `${baseLabel} — ${pick(context)}`;
    }
    return baseLabel;
}

function generateRandomDescription(): string {
    const randomWords: string[] = [
        'iskola',
        'tanár',
        'diák',
        'óra',
        'vizsga',
        'ünnep',
        'karácsony',
        'születésnap',
        'család',
        'anya',
        'apa',
        'gyerek',
        'testvér',
        'barátnő',
        'kolléga',
        'munkahely',
        'iroda',
        'kávé',
        'tea',
        'reggeli',
        'ebéd',
        'vacsora',
        'tányér',
        'kanál',
        'villa',
        'kés',
        'bolt',
        'piac',
        'üzlet',
        'pénz',
        'bank',
        'számla',
        'telefon',
        'internet',
        'email',
        'üzenet',
        'film',
        'színház',
        'könyvtár',
        'park',
        'játszótér',
        'falu',
        'tenger',
        'hegy',
        'erdő',
        'mező',
        'virág',
        'állat',
        'kutya',
        'macska',
        'madár',
        'feladat',
        'napló',
        'bevásárlás',
        'munka',
        'programozás',
        'olvasás',
        'tanulás',
        'számítógép',
        'asztal',
        'ablak',
        'könyv',
        'szék',
        'otthon',
        'város',
        'kert',
        'gyakorlat',
        'szokás',
        'idő',
        'emlék',
        'hétvége',
        'pihenés',
        'kirándulás',
        'barátok',
        'feladatlista',
        'projekt',
        'nyaralás',
        'ötlet',
        'terv',
        'szorgalom',
        'siker',
        'kihívás',
        'élmény',
        'mozi',
        'zene',
        'sport',
        'futás',
        'bicikli',
        'autó',
        'út',
        'ház',
        'szoba',
        'konyha',
        'számítás',
        'tanfolyam',
    ];
    const randomLengthOfDescription = Math.floor(Math.random() * 200) + 1;
    let text = '';
    while (text.length < randomLengthOfDescription) {
        text += randomWords[Math.floor(Math.random() * randomWords.length)] + ' ';
    }
    return text.trim().slice(0, randomLengthOfDescription);
}
