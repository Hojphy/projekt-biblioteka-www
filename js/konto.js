const widokNiezalogowany = document.getElementById('widok-niezalogowany');
const widokZalogowany = document.getElementById('widok-zalogowany');

document.getElementById('zarejestruj-btn').addEventListener('click', function() {
    let login = document.getElementById('rej-login-input').value;
    let haslo = document.getElementById('rej-haslo-input').value;

    if (login === "" || haslo === "") {
        pokazPowiadomienie("Wypełnij wszystkie pola.", "blad");
        return;
    }

    let uzytkownicyTekst = localStorage.getItem("listaUzytkownikow");
    let uzytkownicy = [];
    
    if (uzytkownicyTekst !== null) {
        uzytkownicy = JSON.parse(uzytkownicyTekst); 
    }

    for (let i = 0; i < uzytkownicy.length; i++) {
        if (uzytkownicy[i].login === login) {
            pokazPowiadomienie("Taki login jest juz zajęty.", "blad");
            return;
        }
    }

    let nowyUzytkownik = {
        login: login,
        haslo: haslo
    };
    uzytkownicy.push(nowyUzytkownik);

    localStorage.setItem("listaUzytkownikow", JSON.stringify(uzytkownicy));
    
    pokazPowiadomienie("Konto utworzone. Możesz się teraz zalogować.", "sukces");
    
    login = "";
    haslo = "";
});

document.getElementById('zaloguj-btn').addEventListener('click', function() {
    let loginWpisany = document.getElementById('login-input');
    let hasloWpisane = document.getElementById('haslo-input');

    let uzytkownicyTekst = localStorage.getItem("listaUzytkownikow");
    
    if (uzytkownicyTekst === null) {
        pokazPowiadomienie("Brak zarejestrowanych kont. Najpierw się zarejestruj.", "blad");
        return;
    }

    let uzytkownicy = JSON.parse(uzytkownicyTekst);
    let czyPoprawneDane = false;

    for (let i = 0; i < uzytkownicy.length; i++) {
        if (uzytkownicy[i].login === loginWpisany.value && uzytkownicy[i].haslo === hasloWpisane.value) {
            czyPoprawneDane = true;
            break;
        }
    }

    if (!czyPoprawneDane) {
        pokazPowiadomienie("Błędny login lub hasło.", "blad");
        return;
    }

    localStorage.setItem("zalogowany", "tak");
    localStorage.setItem("aktualnyUzytkownik", loginWpisany.value);
    
    loginWpisany.value = "";
    hasloWpisane.value = "";
    aktualizujWidokKonta(); 
});

document.getElementById("wyloguj-btn").addEventListener("click", wylogujUzytkownika);

function zalogujUzytkownika() {
    localStorage.setItem("zalogowany", "tak");
    aktualizujWidokKonta();
}

function wylogujUzytkownika() {
    localStorage.setItem("zalogowany", "nie");
    localStorage.setItem("aktualnyUzytkownik", "");
    wyczyscKsiazki();
    aktualizujWidokKonta();
}

function aktualizujWidokKonta() {
    const stan = localStorage.getItem("zalogowany");
    if (stan === "tak") {
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
    const wypozyczone = localStorage.getItem(`wypozyczenia_${login}`);
    const wypozyczoneGrid = document.getElementById("konto-wypozyczone");

    if(wypozyczone === null || wypozyczone.length === 0) return;

    wypozyczoneGrid.innerHTML = "";
    JSON.parse(wypozyczone).forEach(ksiazka => {
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


aktualizujWidokKonta();
