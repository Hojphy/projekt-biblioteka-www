function koszykZapisz(ksiazki) {localStorage.setItem("koszyk", JSON.stringify(ksiazki));}

function koszykPobierz() {return JSON.parse(localStorage.getItem("koszyk") || "[]");}
const koszykKsiazki = koszykPobierz();


function zaladujKoszyk() {
    document.querySelectorAll(".koszykElement").forEach(element => element.remove());
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
        const wyporzyczButton = document.createElement("button");
        wyporzyczButton.textContent = "Wypożycz";
        wyporzyczButton.classList.add("koszykWypozycz");
        wyporzyczButton.addEventListener("click", () => { wypozycz(); });
        document.getElementById("main").appendChild(wyporzyczButton);
    }
}

function wypozycz() {
    alert("Wypożyczono książki");
}


zaladujKoszyk();