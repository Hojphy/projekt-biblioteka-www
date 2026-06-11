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
        nowaKsiazka.classList.add("ksiazka");
        nowaKsiazka.innerHTML = ksiazkaHTMLString(ksiazka.simple_thumb, ksiazka.title, ksiazka.author);

        const overlay = document.createElement("div");
        overlay.classList.add("admin-akcje-overlay");

        const pokazBtn = document.createElement("button");
        pokazBtn.classList.add("przycisk-pokaz");
        pokazBtn.innerText = "Pokaż";
        pokazBtn.addEventListener("click", () => {
            window.location.href = `./ksiazka.html?tytul=${ksiazka.slug}`;
        });

        const oddajBtn = document.createElement("button");
        oddajBtn.classList.add("przycisk-oddaj");
        oddajBtn.innerText = "Oddaj";
        oddajBtn.addEventListener("click", () => {
            const index = wypozyczone.findIndex(b => b.slug === ksiazka.slug);
            if (index !== -1) {
                wypozyczone.splice(index, 1);
            }
            pokazPowiadomienie("Oddano książkę.", "sukces");
            localStorage.setItem(`wypozyczenia_${login}`, JSON.stringify(wypozyczone));
            aktualizujWypozyczenia(login);
        });

        overlay.appendChild(pokazBtn);
        overlay.appendChild(oddajBtn);
        
        nowaKsiazka.appendChild(overlay);

        nowaKsiazka.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return;
            e.stopPropagation(); 
            
            document.querySelectorAll(".ksiazki_grid .ksiazka.pokaz-mobilny").forEach(otwartaKsiazka => {
                if (otwartaKsiazka !== nowaKsiazka) {
                    otwartaKsiazka.classList.remove("pokaz-mobilny");
                }
            });
            
            nowaKsiazka.classList.toggle("pokaz-mobilny");
        });
        
        wypozyczoneGrid.appendChild(nowaKsiazka);
    });
}

initStronaAdmina();

document.addEventListener("click", () => {
    document.querySelectorAll(".ksiazki_grid .ksiazka.pokaz-mobilny").forEach(otwartaKsiazka => {
        otwartaKsiazka.classList.remove("pokaz-mobilny");
    });
});
