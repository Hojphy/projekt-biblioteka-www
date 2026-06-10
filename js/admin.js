const admin = "administrator";

function stronaHTML()
{
    return `
        <div class="uzytkownicy">
            <h3>Lista użytkowników</h3>
            <div id="lista-uzytkownikow">
                <p>Brak użytkowników.</p>
            </div>
        </div>
        <div class="wypozyczenia">
            <h3 id="konto-wypozyczenia-naglowek">Wypożyczone książki</h3>
            <div id="konto-wypozyczone" class="ksiazki_grid">
                <p>Brak wypożyczonych książek.</p>
            </div>
        </div>
    `;
}

function uzytkownikHTML(nazwa)
{
    return `
        <p>${nazwa}</p>
        <button id="wypozyczenia-${nazwa}" class="przycisk">Pokaż wypożyczone</button>
    `;
}

function initStronaAdmina()
{
    const login = localStorage.getItem("aktualnyUzytkownik");
    if(login != admin)
    {
        pokazPowiadomienie("Nie jestes administratorem!", "blad");
        return;
    }
    document.getElementById("admin").innerHTML = stronaHTML();
    const uzytkownicy = JSON.parse(localStorage.getItem("listaUzytkownikow"));
    const listaUzytkownikow = document.getElementById("lista-uzytkownikow");
    if(uzytkownicy.length > 0)
    {
        listaUzytkownikow.innerHTML = "";
        uzytkownicy.forEach(uzytkownik => {
            const element = document.createElement("div");
            element.classList.add("uzytkownik");
            element.innerHTML = uzytkownikHTML(uzytkownik.login);
            listaUzytkownikow.appendChild(element);
            document.getElementById(`wypozyczenia-${uzytkownik.login}`).addEventListener("click", () => {
                aktualizujWypozyczenia(uzytkownik.login);
                document.getElementById("konto-wypozyczenia-naglowek").innerHTML = `Wypożyczone książki użytkownika "${uzytkownik.login}"`
                wybranyLogin = uzytkownik.login;
            });
        });
    }
}

function aktualizujWypozyczenia(login) {
    const twojLogin = localStorage.getItem("aktualnyUzytkownik");
    if(twojLogin != admin)
    {
        pokazPowiadomienie("Nie jestes administratorem!", "blad");
        return;
    }
    const wypozyczone = JSON.parse(localStorage.getItem(`wypozyczenia_${login}`));
    const wypozyczoneGrid = document.getElementById("konto-wypozyczone");

    wypozyczoneGrid.innerHTML = "<p>Brak wypożyczonych książek.</p>";

    if(wypozyczone === null || wypozyczone.length === 0) return;

    wypozyczoneGrid.innerHTML = "";

    wypozyczone.forEach(ksiazka => {
        const nowaKsiazka = document.createElement("div");
        nowaKsiazka.classList.add("wypozyczona-ksiazka");
        nowaKsiazka.classList.add("ksiazka");
        nowaKsiazka.innerHTML = ksiazkaHTMLString(ksiazka.simple_thumb, ksiazka.title, ksiazka.author);

        const oddaj = document.createElement("div");
        oddaj.classList.add("przycisk-oddaj");
        oddaj.innerHTML = `<button class="przycisk-oddaj">Oddaj</button>`;
        oddaj.addEventListener("click", () => {
            const index = wypozyczone.indexOf(ksiazka);
            if (index !== -1) {
              wypozyczone.splice(index, 1);
            }
            pokazPowiadomienie("Oddano książkę.", "sukces")
            console.log(wypozyczone);
            localStorage.setItem(`wypozyczenia_${login}`, JSON.stringify(wypozyczone));
            aktualizujWypozyczenia(login);
        });

        const pokaz = document.createElement("div");
        pokaz.classList.add("przycisk-pokaz");
        pokaz.innerHTML = `<button class="przycisk-pokaz">Pokaż</button>`;
        pokaz.addEventListener("click", () => {
            window.location.href = `./ksiazka.html?tytul=${ksiazka.slug}`;
        });

        nowaKsiazka.appendChild(oddaj);
        nowaKsiazka.appendChild(pokaz);
        wypozyczoneGrid.appendChild(nowaKsiazka);
    });
}

initStronaAdmina();
