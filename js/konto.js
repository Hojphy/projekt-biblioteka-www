const widokNiezalogowany = document.getElementById('widok-niezalogowany');
const widokZalogowany = document.getElementById('widok-zalogowany');


const loginLogin = document.getElementById('login-input');
const loginHaslo = document.getElementById('haslo-input');
const loginPrzycisk = document.getElementById('zaloguj-btn');

const rejestracjaLogin = document.getElementById('rej-login-input');
const rejestracjaHaslo = document.getElementById('rej-haslo-input');
const rejestracjaPrzycisk = document.getElementById('zarejestruj-btn');

loginPrzycisk.addEventListener("click", async () => {
    await zalogujPrzycisk();
});

rejestracjaPrzycisk.addEventListener("click", async () => {
    await zarejestrujPrzycisk();
});

[rejestracjaLogin, rejestracjaHaslo].forEach(element => {
    element.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await zarejestrujPrzycisk();
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if(element === rejestracjaHaslo) rejestracjaLogin.focus();
        } 
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if(element === rejestracjaLogin) rejestracjaHaslo.focus();
        } 
        else if(event.key === 'ArrowLeft') {
            event.preventDefault();
            if(element === rejestracjaLogin) loginLogin.focus();
            else loginHaslo.focus();
        }
    });
});

[loginLogin, loginHaslo].forEach(element => {
    element.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await zalogujPrzycisk();
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if(element === loginHaslo) loginLogin.focus();
        } 
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if(element === loginLogin) loginHaslo.focus();
        } 
        else if(event.key === 'ArrowRight') {
            event.preventDefault();
            if(element === loginLogin) rejestracjaLogin.focus();
            else rejestracjaHaslo.focus();
        }
    });
});

document.getElementById("wyloguj-btn").addEventListener("click", wylogujUzytkownika);

async function zarejestrujPrzycisk() {
    let login = document.getElementById('rej-login-input');
    let haslo = document.getElementById('rej-haslo-input');

    if (login.value === "" || haslo.value === "") {
        pokazPowiadomienie("Wypełnij wszystkie pola.", "blad");
        return;
    }

    let uzytkownicyTekst = localStorage.getItem("listaUzytkownikow");
    let uzytkownicy = [];
    
    if (uzytkownicyTekst !== null) {
        uzytkownicy = JSON.parse(uzytkownicyTekst); 
    }

    for (let i = 0; i < uzytkownicy.length; i++) {
        if (uzytkownicy[i].login === login.value) {
            pokazPowiadomienie("Taki login jest juz zajęty.", "blad");
            return;
        }
    }

    const hasloHash = await sha256(haslo.value);

    let nowyUzytkownik = {
        login: login.value,
        haslo: hasloHash.toUpperCase()
    };
    uzytkownicy.push(nowyUzytkownik);

    localStorage.setItem("listaUzytkownikow", JSON.stringify(uzytkownicy));
    
    pokazPowiadomienie("Konto utworzone. Możesz się teraz zalogować.", "sukces");
    
    login.value = "";
    haslo.value = "";
}

async function zalogujPrzycisk() {
    let loginWpisany = document.getElementById('login-input');
    let hasloWpisane = document.getElementById('haslo-input');

    let uzytkownicyTekst = localStorage.getItem("listaUzytkownikow");
    
    if (uzytkownicyTekst === null) {
        pokazPowiadomienie("Błędny login lub hasło.", "blad");
        localStorage.setItem("listaUzytkownikow", JSON.stringify([]));
        return;
    }

    let uzytkownicy = JSON.parse(uzytkownicyTekst);
    let czyPoprawneDane = false;

    const hasloHash = await sha256(hasloWpisane.value);
    for (let i = 0; i < uzytkownicy.length; i++) {
        if (uzytkownicy[i].login === loginWpisany.value && uzytkownicy[i].haslo.toUpperCase() === hasloHash.toUpperCase()) {
            czyPoprawneDane = true;
            break;
        }
    }

    if (!czyPoprawneDane) {
        pokazPowiadomienie("Błędny login lub hasło.", "blad");
        return;
    }

    zalogujUzytkownika(loginWpisany.value);
    loginWpisany.value = "";
    hasloWpisane.value = "";
}

function zalogujUzytkownika(login) {
    localStorage.setItem("zalogowany", "tak");
    localStorage.setItem("aktualnyUzytkownik", login);
    aktualizujWidokKonta();
}

function wylogujUzytkownika() {
    localStorage.setItem("zalogowany", "nie");
    localStorage.setItem("aktualnyUzytkownik", "");
    wyczyscKsiazki();
    aktualizujWidokKonta();
    aktualizujIkoneAdmina();
}

function aktualizujWidokKonta() {
    const stan = localStorage.getItem("zalogowany");
    if (stan === "tak") {
        aktualizujIkoneAdmina();
        initZalogowany();
    } else {
        widokZalogowany.classList.add('ukryty');
        widokNiezalogowany.classList.remove('ukryty');
    }
}

function initZalogowany() {
    widokNiezalogowany.classList.add('ukryty');
    widokZalogowany.classList.remove('ukryty');
    const login = localStorage.getItem("aktualnyUzytkownik");
    document.getElementById("konto-info-login").innerHTML = "<strong>Twój login:</strong> " + login;

    initKsiazki();
}

function initKsiazki() {
    const login = localStorage.getItem("aktualnyUzytkownik");
    const wypozyczone = JSON.parse(localStorage.getItem(`wypozyczenia_${login}`));
    const wypozyczoneGrid = document.getElementById("konto-wypozyczone");

    if(wypozyczone === null || wypozyczone.length === 0) return;

    wypozyczoneGrid.innerHTML = "";
    wypozyczone.forEach(ksiazka => {
        const nowaKsiazka = document.createElement("div");
        nowaKsiazka.classList.add("wypozyczona-ksiazka");
        nowaKsiazka.classList.add("ksiazka");
        nowaKsiazka.innerHTML = ksiazkaHTMLString(ksiazka.simple_thumb, ksiazka.title, ksiazka.author);
        nowaKsiazka.addEventListener("click", () => {
            window.location.href = `./ksiazka.html?tytul=${ksiazka.slug}`;
        });
        wypozyczoneGrid.appendChild(nowaKsiazka);
    });
}

function wyczyscKsiazki() {
    const wypozyczoneGrid = document.getElementById("konto-wypozyczone");
    wypozyczoneGrid.innerHTML = "<p>Brak wypożyczonych książek.</p>";
}

function initKontoAdmina() {
    let uzytkownicy = JSON.parse(localStorage.getItem("listaUzytkownikow"));
    if(uzytkownicy === null) uzytkownicy = [];

    if(!uzytkownicy.some(u => u.login === "administrator"))
    {
        let admin = {
            login: "administrator",
            haslo: "ABE31FE1A2113E7E8BF174164515802806D388CF4F394CCEACE7341A182271AB"
        };
        uzytkownicy.push(admin);
    }
    localStorage.setItem("listaUzytkownikow", JSON.stringify(uzytkownicy));
}

initKontoAdmina();
aktualizujWidokKonta();
