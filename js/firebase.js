const BASE_URL = "https://join-294-1008d-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
}

/* save new contact in firebase */

async function saveData(path = "", data) {
    console.log(`Saving data to path: ${path}`);
    await fetch(`${BASE_URL}${path}.json`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('Data saved successfully');
}