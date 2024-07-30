const BASE_URL = "https://join-294-1008d-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
}