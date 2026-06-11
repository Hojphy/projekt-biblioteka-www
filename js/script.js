// ========== Funkcje pomocnicze ==========

function randomInt(max, min = 0) {
    return Math.floor(Math.random() * max) + min;
}

async function sha256(tekst) {
    const kodowanyTekst = new TextEncoder().encode(tekst);
    const bufor = await crypto.subtle.digest('SHA-256', kodowanyTekst);
    const tablicaBajtow = Array.from(new Uint8Array(bufor));
    const hashHex = tablicaBajtow.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ========== Web Componenty ==========

class Naglowek extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="naglowek" class="lepkie">
                <header>
                    <!-- Ikony po lewej -->
                    <span id="menu-ikona" alt="Menu" class="material-symbols-outlined niezaznaczalne">menu</span>

                    <!-- Ikony po środku -->
                    <a href="./index.html" style="text-decoration: none; color: inherit;">
                        <h1 id="logo">Lekturoteka</h1>
                    </a>

                    <!-- Ikony po prawej -->
                    <span id="naglowekIkonyPoPrawej">
                        <span id="koszykIkona" alt="Koszyk" class="material-symbols-outlined niezaznaczalne">shopping_basket</span>
                        <span id="kontoIkona" alt="Konto" class="material-symbols-outlined niezaznaczalne">account_circle</span>
                        <span id="zmiana-trybu" alt="Zmiana motywu" class="material-symbols-outlined niezaznaczalne"></span>
                        <span id="accessibility-ikona" alt="Dostępność" class="material-symbols-outlined niezaznaczalne">accessibility_new</span>
                    </span>
                </header>
                <div id="accessibility-dropdown" class="dropdown-zawartosc">
                    <p class="dropdown-tytul">Kontrast</p>
                    <div class="dropdown-sekcja">
                        <button id="kontrast-domyslny-btn" class="przycisk dropdown-przycisk">Standardowy</button>
                        <button id="kontrast-wysoki-btn" class="przycisk dropdown-przycisk">Wysoki</button>
                    </div>
                    
                    <p class="dropdown-tytul">Rozmiar czcionki</p>
                    <div class="dropdown-sekcja">
                        <button id="czcionka-0-btn" class="przycisk dropdown-przycisk">Normalny</button>
                        <button id="czcionka-1-btn" class="przycisk dropdown-przycisk">Średni</button>
                        <button id="czcionka-2-btn" class="przycisk dropdown-przycisk">Wysoki</button>
                    </div>
                </div>
             </div>
        `;
        this.inicjalizujDostepnosc();
    }

    inicjalizujDostepnosc() {
        const ikona = this.querySelector("#accessibility-ikona");
        const dropdown = this.querySelector("#accessibility-dropdown");

        ikona.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("pokaz-dropdown");
        });

        document.addEventListener("click", () => {
            dropdown.classList.remove("pokaz-dropdown");
        });

        dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        const zapisanyKontrast = localStorage.getItem("kontrast") || "standard";
        const zapisanaCzcionka = localStorage.getItem("rozmiarCzcionki") || "normalna";

        this.ustawKontrast(zapisanyKontrast);
        this.ustawRozmiarCzcionki(zapisanaCzcionka);

        this.querySelector("#kontrast-domyslny-btn").addEventListener("click", () => this.ustawKontrast("standard"));
        this.querySelector("#kontrast-wysoki-btn").addEventListener("click", () => this.ustawContrastWysoki());

        this.querySelector("#czcionka-0-btn").addEventListener("click", () => this.ustawRozmiarCzcionki("normalna"));
        this.querySelector("#czcionka-1-btn").addEventListener("click", () => this.ustawRozmiarCzcionki("duza"));
        this.querySelector("#czcionka-2-btn").addEventListener("click", () => this.ustawRozmiarCzcionki("bardzo-duza"));
    }

    ustawKontrast(tryb) {
        if (tryb === "wysoki") {
            document.documentElement.classList.add("wysoki-kontrast");
        } else {
            document.documentElement.classList.remove("wysoki-kontrast");
        }
        localStorage.setItem("kontrast", tryb);
    }

    ustawContrastWysoki() {
        this.ustawKontrast("wysoki");
    }

    ustawRozmiarCzcionki(rozmiar) {
        document.documentElement.classList.remove("czcionka-normalna", "czcionka-duza", "czcionka-bardzo-duza");
        
        if (rozmiar === "duza") {
            document.documentElement.classList.add("czcionka-duza");
        } else if (rozmiar === "bardzo-duza") {
            document.documentElement.classList.add("czcionka-bardzo-duza");
        } else {
            document.documentElement.classList.add("czcionka-normalna");
        }
        localStorage.setItem("rozmiarCzcionki", rozmiar);
    }
}
customElements.define('komponent-naglowek', Naglowek);

class Nawigacja extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="nawigacja">
            <nav>
                <ul>
                    <li><a href="./wyszukiwarka.html?filter=gatunki">Gatunki</a></li>
                    <li><a href="./wyszukiwarka.html?filter=epoki">Epoki</a></li>
                    <li><a href="./wyszukiwarka.html?filter=rodzaje">Rodzaje</a></li>
                </ul>
            </nav>
        </div>`;
    }
}

customElements.define('komponent-nawigacja', Nawigacja);

class Wyszukiwarka extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="wyszukiwarka">
            <form action="wyszukiwarka.html" method="GET">
                <input type="text" name="zapytanie" id="wyszukiwarka-textbox" placeholder="Wyszukaj ksiazke...">
            </form>
        </section>`;
    }
}

customElements.define('komponent-wyszukiwarka', Wyszukiwarka);

class Powiadomienia extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div id="widok-powiadomienia"></div>`;
    }
}

customElements.define('komponent-powiadomienia', Powiadomienia);

// ========== Przyciski na sticky ==========

const menuButton = document.getElementById("menu-ikona");
const koszykPrzycisk = document.getElementById("koszykIkona");
const kontoPrzycisk = document.getElementById("kontoIkona");
const zmianaTrybuPrzycisk= document.getElementById("zmiana-trybu");
const nawigacja = document.getElementById("nawigacja");
const main = document.getElementById("main");

// === Funkcje na kliknięcie przycisków ===

if(menuButton) {
    menuButton.addEventListener("click", menuClick);
}

if (koszykPrzycisk) {koszykPrzycisk.addEventListener("click", koszykClick);}
if (kontoPrzycisk) {kontoPrzycisk.addEventListener("click", kontoClick);}

if(zmianaTrybuPrzycisk) {
    zmianaTrybuPrzycisk.addEventListener("click", zmianaTrybuClick);
    initIkonaNaglowka();
}

// === Funkcje po kliknięciu przycisku ===

function aktualizujIkoneAdmina()
{
    const adminIkona = document.getElementById("adminIkona");
    if(adminIkona) adminIkona.remove();

    const login = localStorage.getItem("aktualnyUzytkownik");
    if(login != "administrator") return;

    const element = document.createElement("span");
    element.classList.add("material-symbols-outlined");
    element.classList.add("niezaznaczalne");
    element.id = "adminIkona";
    element.alt = "Admin";
    element.innerHTML = `shield_person`;
    element.addEventListener("click", () => {
        window.location.href = "./admin.html";
    });
    document.getElementById("naglowekIkonyPoPrawej").appendChild(element);
}

aktualizujIkoneAdmina();

function koszykClick() {window.location.href = "./koszyk.html";}
function kontoClick() {window.location.href = "./konto.html";}

function initIkonaNaglowka() {
    const theme = localStorage.getItem("theme");
    if(theme != null)
        zmianaTrybuPrzycisk.innerHTML = theme == "dark" ? "dark_mode" : "light_mode";
    else
        zmianaTrybuPrzycisk.innerHTML = "dark_mode";
}

function zmianaTrybuClick() {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark");
    document.documentElement.classList.toggle("light");
    localStorage.setItem("theme", theme == "dark" ? "light" : "dark");
    initIkonaNaglowka();
}

function ustawKontrast(tryb) {
    if (tryb === "wysoki") {
        document.documentElement.classList.add("wysoki-kontrast");
    } else {
        document.documentElement.classList.remove("wysoki-kontrast");
    }
    localStorage.setItem("kontrast", tryb);
}

function ustawRozmiarCzcionki(rozmiar) {
    document.documentElement.classList.remove("czcionka-normalna", "czcionka-duza", "czcionka-bardzo-duza");
    
    if (rozmiar === "duza") {
        document.documentElement.classList.add("czcionka-duza");
    } else if (rozmiar === "bardzo-duza") {
        document.documentElement.classList.add("czcionka-bardzo-duza");
    } else {
        document.documentElement.classList.add("czcionka-normalna");
    }
    localStorage.setItem("rozmiarCzcionki", rozmiar);
}

// ========== Książki ==========

async function getDane(what) {
    const url = `https://wolnelektury.pl/api/${what}`;
    const data = await fetch(url);
    const json = await data.json();
    return json;
}

async function getBooks() {
    const json = await getDane("books");
    return json;
}

async function getGenres() {
    const json = await getDane("genres");
    return json;
}

async function getEpochs() {
    const json = await getDane("epochs");
    return json;
}

async function getKinds() {
    const json = await getDane("kinds");
    return json;
}

async function getThemes() {
    const json = await getDane("themes");
    return json;
}

function ksiazkaHTMLString(img, title, author) {
    return `
        <img src="${img}"></img>
        <h3 class="tytul">${title}</h3>
        <p class="autor">${author}</p>
    `;
}

// ========== Powiadomienia ==========

function pokazPowiadomienie(wiadomosc, typ="sukces") {
    const kontener = document.getElementById('widok-powiadomienia');
    
    const nowePowiadomienie = document.createElement('div');
    nowePowiadomienie.classList.add('powiadomienie');
    nowePowiadomienie.classList.add(typ);
    
    nowePowiadomienie.innerText = wiadomosc;
    
    kontener.appendChild(nowePowiadomienie);
    
    setTimeout(function() {
        nowePowiadomienie.remove();
    }, 3000);
}


// ========== Znikająca wyszukiwarka ==========

const wyszukiwarka = document.getElementById("wyszukiwarka");
let ostatniScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if(wyszukiwarka === null) return;
    const scrollY = window.scrollY;

    //Sprawdzenie, czy był scroll w dół czy w góre i czy scroll był dość duży, ignoruje bardzo małe ruchy
    if(scrollY > ostatniScrollY && (scrollY - ostatniScrollY) > 5) {
        wyszukiwarka.classList.add("ukryty");
    } else if(scrollY < ostatniScrollY && (ostatniScrollY - scrollY) > 5) {
        wyszukiwarka.classList.remove("ukryty");
    }

    ostatniScrollY = scrollY;
})

document.addEventListener("DOMContentLoaded", () => {
    const zapisanyKontrast = localStorage.getItem("kontrast") || "standard";
    const zapisanaCzcionka = localStorage.getItem("rozmiarCzcionki") || "normalna";

    ustawKontrast(zapisanyKontrast);
    ustawRozmiarCzcionki(zapisanaCzcionka);

    document.getElementById("kontrast-domyslny-btn")?.addEventListener("click", () => {
        ustawKontrast("standard");
    });
    document.getElementById("kontrast-wysoki-btn")?.addEventListener("click", () => {
        ustawKontrast("wysoki");
    });

    document.getElementById("czcionka-0-btn")?.addEventListener("click", () => {
        ustawRozmiarCzcionki("normalna");
    });
    document.getElementById("czcionka-1-btn")?.addEventListener("click", () => {
        ustawRozmiarCzcionki("duza");
    });
    document.getElementById("czcionka-2-btn")?.addEventListener("click", () => {
        ustawRozmiarCzcionki("bardzo-duza");
    });
});

function menuClick() {
    nawigacja.classList.toggle("active");
    main.classList.toggle("active");
    wyszukiwarka.classList.toggle("active");
}
