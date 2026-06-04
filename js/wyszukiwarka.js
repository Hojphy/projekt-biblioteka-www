const mainContent = document.querySelector('main');
const browserList = document.getElementById("browserList");
const pagerElement = document.getElementById("browserPager");
const pagesElement = document.getElementById("browserPagerPages");
const prevButton = document.getElementById('pagerPrev');
const nextButton = document.getElementById('pagerNext');

const ITEMS_PER_PAGE = 15;

let currentPage = 1;
let pageCount;
let filteredBooksJSON;
// ======= Pobranie parametrów z URL =======

const params = new URLSearchParams(window.location.search);

// ======= Pobranie zapytania z URL =======

const query = params.get('zapytanie');

if (query) {
    document.getElementById("wyszukiwarka-textbox").value = query;

    initBookList(query);


}

// ========== Pobranie filtru z URL =======

const filter = params.get('filter');
const subfilter = params.get('subfilter');

if (subfilter) {
    initFilteredBookList(filter, subfilter);
}
else if (filter) {
    initFilterList(filter);
}

async function getBooksByTitle(fragment)
{
    const allBooks = await getBooks();
    const cleared_fragment = fragment.toLowerCase().trim();
    
    return allBooks.filter(book => {
        const element_title = book.title.toLowerCase();
        return element_title.includes(cleared_fragment)
    });
}

async function getFilterCategoriesJSON(filter)
{
    switch(filter)
    {
        case "gatunki":
            const genres = await getGenres();
            return genres;
        case "epoki":
            const epochs = await getEpochs();
            return epochs;
        case "rodzaje":
            const kinds = await getKinds();
            return kinds;
        case "motywy":
            const themes = await getThemes();
            return themes;
    }
}

function browserElementHTMLString(img, title, author) {
    return `
        <img src="${img}"></img>
        <div class="bookInfo">
            <h1 class="autor">${author}</h1>
            <h2 class="tytul">${title}</h3>
        </div>
    `;
}

function filterHTMLString(name) {
    return `
        <p class="filterName unselectable">${name}</p>
    `;
}

function pageClick(e)
{
    const clickedPage = parseInt(e.target.innerText);
    currentPage = clickedPage;

    browserList.innerHTML = "";

    renderPage(currentPage);
    initPager(filteredBooksJSON.length);
}

function addPage(number)
{
    const newPage = document.createElement("li");
    newPage.innerText = number;
    newPage.classList.add("page-number");

    if(number == currentPage)
        newPage.classList.add("currentPage");
    else
        newPage.addEventListener("click", pageClick);

    nextButton.insertAdjacentElement('beforebegin', newPage);
}

function initPager(resultCount)
{
    const oldPages = document.querySelectorAll(".page-number");
    oldPages.forEach(page => page.remove());

    const pageCount = Math.ceil(resultCount/ITEMS_PER_PAGE);

    if (pageCount <= 1) return;

    const maxVisiblePages = 10;
    let startPage = 1;
    let endPage = pageCount;

    if (pageCount > maxVisiblePages) {
        startPage = currentPage - 4;
        endPage = currentPage + 5;

        if (startPage < 1) {
            startPage = 1;
            endPage = maxVisiblePages;
        }

        if (endPage > pageCount) {
            endPage = pageCount;
            startPage = pageCount - maxVisiblePages + 1;
        }
    }

    for(let i = startPage; i <= endPage; i++)
    {
        addPage(i);
    }

    const totalPages = Math.ceil(resultCount / ITEMS_PER_PAGE);

    if (currentPage === 1) {
        pagerPrev.classList.add("disabled");
    } else {
        pagerPrev.classList.remove("disabled");
    }

    if (currentPage === totalPages || totalPages <= 1) {
        pagerNext.classList.add("disabled");
    } else {
        pagerNext.classList.remove("disabled");
    }
}

async function initBookList(titleName)
{
    browserList.innerHTML = "";
    filteredBooksJSON = await getBooksByTitle(titleName);

    renderPage(currentPage);
    initPager(filteredBooksJSON.length);
   
}

async function initFilteredBookList(filter, subfilter)
{
    browserList.innerHTML = "";
    filteredBooksJSON = await getBooksByChosenFilter(filter, subfilter);

    renderPage(currentPage);
    initPager(filteredBooksJSON.length);
   
}

async function renderPage(page)
{
    const startIdx = (page-1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;

    const booksToShow = filteredBooksJSON.slice(startIdx, endIdx);

    booksToShow.forEach(item => {
        const filterElement = document.createElement("div");
        filterElement.classList.add("browserElement");
        filterElement.innerHTML = browserElementHTMLString(item.simple_thumb, item.title, item.author);

        filterElement.dataset.href = item.href;
        filterElement.addEventListener('click', () => {
            window.location.href = `./ksiazka.html?tytul=${item.slug}`;
        });
        browserList.appendChild(filterElement);
    });
}

async function initFilterList(filterName)
{
    const filtersJSON = await getFilterCategoriesJSON(filterName);
    const browserList = document.getElementById("browserList");
    filtersJSON.forEach(filter => {
        const filterElement = document.createElement("div");
        filterElement.classList.add("browserElement");
        filterElement.innerHTML = filterHTMLString(filter.name);
        filterElement.dataset.href = filter.href;
        filterElement.addEventListener('click', () => {
            window.location.href = `./wyszukiwarka.html?filter=${encodeURIComponent(filterName)}&subfilter=${encodeURIComponent(filter.name)}`;
        });
        browserList.appendChild(filterElement);
    });
}

async function getBooksByChosenFilter(filter, subfilter)
{
    const allBooks = await getBooks();
    const cleared_subfilter = subfilter.toLowerCase().trim();
    
    return allBooks.filter(book => {
        let element_filter;
        switch(filter)
        {
            case "gatunki":
                element_filter = book.genre.toLowerCase();
                break;
            case "epoki":
                element_filter = book.epoch.toLowerCase();
                break;
            case "rodzaje":
                element_filter = book.kind.toLowerCase();
                break;
        }
        return element_filter == cleared_subfilter;
    });
}

pagerPrev.addEventListener("click", () => {
    if(currentPage <= 1) return;
    currentPage--;

    browserList.innerHTML = "";

    renderPage(currentPage);
    initPager(filteredBooksJSON.length);
});

pagerNext.addEventListener("click", () => {
    if(currentPage >= filteredBooksJSON.length/ITEMS_PER_PAGE) return;
    currentPage++;

    browserList.innerHTML = "";

    renderPage(currentPage);
    initPager(filteredBooksJSON.length);
});
