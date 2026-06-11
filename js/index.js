async function initBooks() {
    const ksiazki = await getBooks();
    const ksiazkiGrid = document.getElementsByClassName("ksiazki_grid")[0];
    const nieskonczonyScroll = document.getElementById("nieskonczonyScroll");

    // „IntersectionObserver” to klasa, która mówi nam, kiedy dany element pojawia się na ekranie użytkownika
    const observer = new IntersectionObserver((ksiazkaObserwowana) => {
        if (ksiazkaObserwowana[0].isIntersecting) { // Musi być [0], bo to jest tablica        
            for (let i = 0; i < 15; i++) { // 15 książek na raz ładuje
                const randomBook = ksiazki.splice(randomInt(ksiazki.length), 1)[0];

                const element = document.createElement("div");
                element.classList.add("ksiazka");

                element.innerHTML = ksiazkaHTMLString(randomBook.simple_thumb, randomBook.title, randomBook.author);

                element.addEventListener("click", () => {
                    window.location.href = `./ksiazka.html?tytul=${randomBook.slug}`;
                });

                // Linijka poniżej pokazuje pełny tytuł książki po najechaniu myszką
                element.setAttribute("title", `${randomBook.title}`);
                
                ksiazkiGrid.appendChild(element);
            }
        }
    });

    observer.observe(nieskonczonyScroll); // To jest ten element, który obserwujemy
}

initBooks();