function ksiazkaKolorTla(ksiazkaZapisana) {
    document.documentElement.style.setProperty(
        '--box-shadow',
        `${ksiazkaZapisana.cover_color}`
    );

    document.documentElement.style.setProperty(
        '--background-button',
        `${ksiazkaZapisana.cover_color}`
    );
}

var ksiazkaZapisana;
async function wlaczKsiazkaDetale() {
    const ksiazki = await getBooks();
    const ksiazkaSzukana = new URLSearchParams(window.location.search);

    ksiazkaZapisana = ksiazki.find(szukana => szukana.slug === ksiazkaSzukana.get("tytul"));

    if (!ksiazkaZapisana) {
        document.getElementById("ksiazkaDetale").textContent = "Nie znaleziono książki";
        return;
    }

    document.getElementById("ksiazkaDetale").innerHTML = ksiazkaDetale(
        ksiazkaZapisana.title, ksiazkaZapisana.author, ksiazkaZapisana.simple_thumb,
        ksiazkaZapisana.epoch, ksiazkaZapisana.kind, ksiazkaZapisana.genre);

    ksiazkaKolorTla(ksiazkaZapisana);

    //document.getElementById("wyszukiwarka-textbox").value = ksiazkaZapisana.title
    document.getElementById("wyszukiwarka-textbox").placeholder = ksiazkaZapisana.title;

    const ksiazkaDodajDoKoszykaZmienna = document.getElementById("ksiazkaDetaleDodajDoKoszyka");
    const ksiazkaDodajDoKoszykaBlad = document.getElementById("ksiazkaDetaleDodajDoKoszykaBlad");
    if (ksiazkaDodajDoKoszykaZmienna) {
        ksiazkaDodajDoKoszykaZmienna.classList.add("ksiazkaDetaleDodajDoKoszyka");
        ksiazkaDodajDoKoszykaZmienna.addEventListener("click", ksiazkaDodajDoKoszyka);
    }else if (ksiazkaDodajDoKoszykaBlad) {
        ksiazkaDodajDoKoszykaBlad.classList.add("wylaczone");
        ksiazkaDodajDoKoszykaBlad.disabled = true;
        ksiazkaDodajDoKoszykaBlad.classList.add("ksiazkaDetaleDodajDoKoszyka");
    }
}

wlaczKsiazkaDetale();

const motywZmiana = document.getElementById("zmiana-trybu");
motywZmiana.addEventListener("click", () => {
    if (!ksiazkaZapisana) return;
    ksiazkaKolorTla(ksiazkaZapisana);
});

function ksiazkaDetale(tytul, autor, okladka, epoka, rodzaj, gatunek) {
    let htmlString = `
        <h3 class="tytul" id="ksiazkaDetaleTytul">${tytul}</h3>
        <a class="ksiazkaDetaleLinki" id="ksiazkaDetaleAutor"href="./wyszukiwarka.html?filter=${autor}">
            ${autor}
        </a>

        <img src="${okladka}" id="ksiazkaDetaleOkladka"></img>

        <nav><ul id="ksiazkaDetaleEpokaRodzajGatunek">
            <li>
                <span class="ksiazkaDetaleGrubyTekst">Epoka:</span>
                <a class="ksiazkaDetaleLinki" href="./wyszukiwarka.html?filter=epoki&subfilter=${epoka}">
                    ${epoka}
                </a>
            </li>

            <li>
                <span class="ksiazkaDetaleGrubyTekst">Rodzaj:</span>
                <a class="ksiazkaDetaleLinki" href="./wyszukiwarka.html?filter=rodzaje&subfilter=${rodzaj}">
                    ${rodzaj}
                </a>
            </li>

            <li>
                <span class="ksiazkaDetaleGrubyTekst">Gatunek:</span>
                <a class="ksiazkaDetaleLinki" href="./wyszukiwarka.html?filter=gatunki&subfilter=${gatunek}">
                    ${gatunek}
                </a>
            </li>
        </ul></nav>
    `;
    if(localStorage.getItem("zalogowany") == "nie") {
        htmlString += `
            <button id="ksiazkaDetaleDodajDoKoszykaBlad" type="button">
                Zaloguj się, aby wypożyczyć
            </button>
        `;
    }else if(ksiazkaJestWypozyczona(ksiazkaZapisana.url)) {
        htmlString += `
            <button id="ksiazkaDetaleDodajDoKoszykaBlad" type="button">
                Książka jest wypożyczona
            </button>
        `;
    }else if(ksiazkaJestWKoszyku(ksiazkaZapisana.url)) {
        htmlString += `
            <button id="ksiazkaDetaleDodajDoKoszykaBlad" type="button">
                Książka jest w koszyku
            </button>
        `;
    }else{
        htmlString += `
            <button id="ksiazkaDetaleDodajDoKoszyka" type="button">
                Dodaj książkę do koszyka
            </button>
        `;
    }
    return htmlString;
}

function ksiazkaJestWypozyczona(ksiazkaUrl) {
    for (let i = 0; i < localStorage.length; i++) {
        const klucz = localStorage.key(i);
        if (!klucz || !klucz.startsWith("wypozyczenia_")) continue;

        const wypozyczenia = localStorage.getItem(klucz);
        if (!wypozyczenia) continue;

        const listaKsiazek = JSON.parse(wypozyczenia);
        if (listaKsiazek.some(ksiazka => ksiazka.url === ksiazkaUrl)) {
            return true;
        }
    }
    return false;
}

function ksiazkaJestWKoszyku(ksiazkaUrl) {
    const koszyk = JSON.parse(localStorage.getItem("koszyk") || "[]");
    return koszyk.some(ksiazka => ksiazka.url === ksiazkaUrl);
}

function ksiazkaDodajDoKoszyka() {
    const koszyk = JSON.parse(localStorage.getItem("koszyk") || "[]");
    const przycisk = document.getElementById("ksiazkaDetaleDodajDoKoszyka");

    if (ksiazkaJestWypozyczona(ksiazkaZapisana.url)) {
        pokazPowiadomienie("Książka jest już wypożyczona.", "blad");
        return;
    }

    if (ksiazkaJestWKoszyku(ksiazkaZapisana.url)) {
        pokazPowiadomienie("Książka jest już w koszyku.", "blad");
        return;
    }

    koszyk.push(ksiazkaZapisana);
    localStorage.setItem("koszyk", JSON.stringify(koszyk));
    pokazPowiadomienie("Książka została dodana do koszyka.", "sukces");
    przycisk.classList.add("wylaczone");
    przycisk.disabled = true;
    przycisk.textContent = "Książka jest już w koszyku";
    przycisk.style.cursor = "not-allowed";
}
