function koszykZapisz(ksiazki) {
    localStorage.setItem("koszyk", JSON.stringify(ksiazki));
}

function koszykPobierz() {
    return JSON.parse(localStorage.getItem("koszyk") || "[]");
}

let koszykKsiazki;

function zaladujKoszyk() {
    koszykKsiazki = koszykPobierz();
    document.querySelectorAll(".koszykElement").forEach(element => element.remove());
    document.querySelectorAll(".koszykWypozycz").forEach(element => element.remove());
    document.getElementById("koszyk").innerHTML = "";
    for (let i = 0; i < koszykKsiazki.length; i++) {
        const nowyDiv = document.createElement("div");
        //nowyDiv.textContent = koszykKsiazki[i].title;

        const ksiazkaDiv = document.createElement("div");

        nowyDiv.classList.add("koszykElement");

        ksiazkaDiv.classList.add("ksiazka");
        ksiazkaDiv.innerHTML = ksiazkaHTMLString(koszykKsiazki[i].simple_thumb, koszykKsiazki[i].title, koszykKsiazki[i].author);
    
        nowyDiv.appendChild(ksiazkaDiv);

        const usunZawartoscButton = document.createElement("button");
        usunZawartoscButton.textContent = "Usuń";
        usunZawartoscButton.classList.add("koszykUsunZawartosc");   
        usunZawartoscButton.addEventListener("click", () => {
            koszykKsiazki.splice(i, 1);
            koszykZapisz(koszykKsiazki);
            zaladujKoszyk();
        });
        ksiazkaDiv.addEventListener("click", () => {
            window.location.href = `./ksiazka.html?tytul=${koszykKsiazki[i].slug}`;
        });

        nowyDiv.appendChild(usunZawartoscButton);
        document.getElementById("koszyk").appendChild(nowyDiv);

        
    }

    if(koszykKsiazki.length != 0) {
        const wypozyczButton = document.createElement("button");
        wypozyczButton.textContent = "Wypożycz";
        wypozyczButton.classList.add("koszykWypozycz");
        wypozyczButton.addEventListener("click", () => { wypozycz(); });
        document.getElementById("main").appendChild(wypozyczButton);
    }else{
        document.getElementById("main").innerHTML += "<p class='KoszykPusty'>Twój koszyk jest pusty</p>";
    }
}

function wypozycz() {
    const stan = localStorage.getItem("zalogowany");
    if(stan != "tak")
    {
        pokazPowiadomienie("Musisz się zalogować!", "blad");
        return;
    }

    const aktualnyUzytkownik = localStorage.getItem("aktualnyUzytkownik");
    const kluczWypozyczen = "wypozyczenia_" + aktualnyUzytkownik;

    let zapisaneKsiazkiTekst = localStorage.getItem(kluczWypozyczen);
    let listaKsiazek = [];

    if (zapisaneKsiazkiTekst !== null && zapisaneKsiazkiTekst.length > 0) {
        listaKsiazek = JSON.parse(zapisaneKsiazkiTekst);
    }

    let noweKsiazki = [];

    let pomyslne = 0;
    for (let i = 0; i < koszykKsiazki.length; i++) {
        console.log(koszykKsiazki[i]);
        console.log(listaKsiazek);
        if(!listaKsiazek.some(x => x.url === koszykKsiazki[i].url))
        {
            noweKsiazki.push(koszykKsiazki[i]);
            pomyslne++;
        }
    }

    localStorage.setItem(kluczWypozyczen, JSON.stringify(listaKsiazek.concat(noweKsiazki)));

    pokazPowiadomienie(`Pomyślnie wypożyczono ${pomyslne}/${koszykKsiazki.length} książek.`, "sukces");

    koszykKsiazki = [];
    koszykZapisz(koszykKsiazki);
    zaladujKoszyk();

}


zaladujKoszyk();
