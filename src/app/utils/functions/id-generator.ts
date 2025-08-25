export function generateRandomId(length: number): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const allCharacters: string = lowercase + uppercase + digits;

    const allCharactersArray: string[] = allCharacters.split('');
    const allCharactersArrayInRandomOrder: string[] = allCharactersArray.sort(
        () => Math.random() - 0.5,
    );
    const allCharactersMixedUp: string = allCharactersArrayInRandomOrder.join('');

    let generatedPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex: number = Math.floor(Math.random() * allCharactersMixedUp.length);
        generatedPassword += allCharactersMixedUp.at(randomIndex);
    }

    return generatedPassword;
}
