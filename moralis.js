const APP_ID = "FenTSXcze1oGL2cRKMOz9woy4uUGCuEtUzR4VhLV";
const SERVER_URL = "https://ye49k0nz6dg9.usemoralis.com:2053/server";

Moralis.initialize(APP_ID); // Application id from moralis.io
Moralis.serverURL = SERVER_URL; //Server url from moralis.io
async function login() {
    try {
        user = await Moralis.Web3.authenticate();
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

async function logout() {
    try {
        await Moralis.User.logOut();
        location.reload();
    } catch (error) {
        console.log(error);
    }
}


window.onload = async (event) => {
    document.getElementById("userInfo").html = "";

    const currentUser = Moralis.User.current();
    if (currentUser) {
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "block";
        //document.getElementById("userInfo").innerHTML = "Current User: " + currentUser.attributes.ethAddress;

    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("logoutButton").style.display = "none";
    }

    document.getElementById("loginButton").onclick = login;
    document.getElementById("logoutButton").onclick = logout;


};

