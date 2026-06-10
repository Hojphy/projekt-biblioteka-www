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
    if (ksiazkaDodajDoKoszykaZmienna) {ksiazkaDodajDoKoszykaZmienna.addEventListener("click", ksiazkaDodajDoKoszyka);}
}

wlaczKsiazkaDetale();

const motywZmiana = document.getElementById("mode-switch");
motywZmiana.addEventListener("click", () => {
    if (!ksiazkaZapisana) return;
    ksiazkaKolorTla(ksiazkaZapisana);
});

function ksiazkaDetale(tytul, autor, okladka, epoka, rodzaj, gatunek) {
    return `
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

        <button id="ksiazkaDetaleDodajDoKoszyka" type="button">
            Dodaj książkę do koszyka
        </button>
    `;
}

function ksiazkaDodajDoKoszyka() {
    const koszyk = JSON.parse(localStorage.getItem("koszyk") || "[]");
    koszyk.push(ksiazkaZapisana);
    localStorage.setItem("koszyk", JSON.stringify(koszyk));
}
