async function initBooks() {
    const books = await getBooks();
    const len = books.length;
    const elements = document.getElementsByClassName("ksiazka");
    Array.from(elements).forEach(element => {
        const randomBook = books[randomInt(len)]
        element.innerHTML = ksiazkaHTMLString(randomBook.simple_thumb, randomBook.title, randomBook.author);

        element.addEventListener("click", () => {
            window.location.href = `./ksiazka.html?tytul=${randomBook.slug}`;
        });

        // Linijka poniżej pokazuje pełny tytuł książki po najechaniu myszką
        element.setAttribute("title", `${randomBook.title}`);
    });
}

initBooks()
