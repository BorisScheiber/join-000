const BASE_URL = "https://join-294-1008d-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
}

/* contacts*/
// save and delete new contact in firebase 

async function saveData(path = "", data) {
    await fetch(`${BASE_URL}${path}.json`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
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

// save updated contact

async function saveDataToFirebase(contactId, contactData) {
    await fetch(`${BASE_URL}contacts/${contactId}.json`, {
        method: 'PUT',
        body: JSON.stringify(contactData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


/*tasks */

// Function to delete data from Firebase
async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
    });
    return responseAsJson = await response.json();
  }

// Function to edit data from Firebase

  async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/*Board */

// Function to update data from Firebase with PATCH method
async function patchData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
