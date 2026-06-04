function koszykZapisz(ksiazki) {localStorage.setItem("koszyk", JSON.stringify(ksiazki));}

function koszykPobierz() {return JSON.parse(localStorage.getItem("koszyk") || "[]");}
const koszykKsiazki = koszykPobierz();

for (let i = 0; i < koszykKsiazki.length; i++) {
    const nowyDiv = document.createElement("div");
    nowyDiv.textContent = koszykKsiazki[i].title;
    document.getElementById("koszyk").appendChild(nowyDiv);
}