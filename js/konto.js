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
    
    document.getElementById('rej-login-input').value = "";
    document.getElementById('rej-haslo-input').value = "";
});

document.getElementById('zaloguj-btn').addEventListener('click', function() {
    let loginWpisany = document.getElementById('login-input').value;
    let hasloWpisane = document.getElementById('haslo-input').value;

    let uzytkownicyTekst = localStorage.getItem("listaUzytkownikow");
    
    if (uzytkownicyTekst === null) {
        pokazPowiadomienie("Brak zarejestrowanych kont. Najpierw się zarejestruj.", "blad");
        return;
    }

    let uzytkownicy = JSON.parse(uzytkownicyTekst);
    let czyPoprawneDane = false;

    for (let i = 0; i < uzytkownicy.length; i++) {
        if (uzytkownicy[i].login === loginWpisany && uzytkownicy[i].haslo === hasloWpisane) {
            czyPoprawneDane = true;
            break;
        }
    }

    if (!czyPoprawneDane) {
        pokazPowiadomienie("Błędny login lub hasło.", "blad");
        return;
    }

    localStorage.setItem("zalogowany", "tak");
    localStorage.setItem("aktualnyUzytkownik", loginWpisany);
    
    aktualizujWidokKonta(); 
    
    document.getElementById("konto-info-login").innerHTML = "<strong>Twój login:</strong> " + loginWpisany;
});

document.getElementById("wyloguj-btn").addEventListener("click", () => {
    localStorage.setItem("zalogowany", "nie");
    localStorage.setItem("aktualnyUzytkownik", "");
    aktualizujWidokKonta();
});

function zalogujUzytkownika() {
    localStorage.setItem("zalogowany", "tak");
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

    if(wypozyczone.length === 0) return;

    wypozyczoneGrid.innerHTML = "";
    JSON.parse(wypozyczone).forEach(ksiazka => {
        const nowaKsiazka = document.createElement("div");
        nowaKsiazka.id = "wypozyczona-ksiazka";
        nowaKsiazka.classList.add("ksiazka");
        nowaKsiazka.innerHTML = ksiazkaHTMLString(ksiazka.simple_thumb, ksiazka.title, ksiazka.author);
        wypozyczoneGrid.appendChild(nowaKsiazka);
    });
}


aktualizujWidokKonta();
