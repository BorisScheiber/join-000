const BASE_URL = "https://join-294-1008d-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
}

/* save new contact in firebase */

async function saveData(path = "", data) {
    await fetch(`${BASE_URL}${path}.json`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function saveDataToFirebase(contact) {
    const contactId = contact.name.split(' ').join('-').toLowerCase();
    await saveData(`contacts/${contactId}`, contact);
}

async function removeData(path = "") {
    try {
        let response = await fetch(`${BASE_URL}${path}.json`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Daten: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fehler beim Entfernen von Daten an Pfad ${path}:`, error);
        throw error;
    }
}