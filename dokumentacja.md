# Projekt "Lekturoteka" - Biblioteka online
Strona biblioteki online, która umożliwia oglądanie książek z API Wolnych Lektur. Pozwala ona przeglądać książki po autorze, epoce, rodzaju czy gatunku. Umożliwia również wyszukanie książek za pomocą wyszukiwarki. Posiada również system kont, wraz z „wypożyczaniem" książek.

### Użyte technologie i zasoby:
- HTML5
- CSS3
- JavaScript
- API wolnelektury.pl
- Google Fonts

### Struktura plików
- `css/` - folder wszystkich plików .css
  - `style.css` - ogólny CSS dla elementów znajdujących się na wielu podstronach
  - `index.css` - style strony głównej
  - `konto.css` - style podstrony konta użytkownika
  - `koszyk.css` - style podstrony koszyka
  - `ksiazka.css` - style podstrony szczegółów książki
  - `wyszukiwarka.css` - style podstrony wyszukiwarki
- `html/` - folder wszystkich plików .html
  - `index.html` - strona główna z polecanymi książkami
  - `konto.html` - podstrona logowania, rejestracji i zarządzania kontem
  - `koszyk.html` - podstrona koszyka z wybranymi książkami
  - `ksiazka.html` - podstrona ze szczegółami wybranej książki
  - `wyszukiwarka.html` - podstrona wyszukiwarki i przeglądania po filtrach
- `js/` - folder wszystkich plików .js
  - `script.js` - JavaScript dla skryptów znajdujących się na wielu podstronach (komponenty, pobieranie danych z API, powiadomienia)
  - `index.js` - obsługa nieskończonego scrolla na stronie głównej
  - `konto.js` - logika logowania, rejestracji i zarządzania kontem
  - `koszyk.js` - obsługa koszyka i wypożyczania książek
  - `ksiazka.js` - wyświetlanie szczegółów książki i dodawanie do koszyka
  - `wyszukiwarka.js` - wyszukiwanie, filtrowanie i paginacja wyników
- `dokumentacja.md` - ta dokumentacja

## Jak uruchomić projekt lokalnie
1. Sklonuj repozytorium lub pobierz pliki projektu.
2. Otwórz plik `html/index.html` i uruchom go za pomocą lokalnego serwera (np. za pomocą rozszerzenia *Live Preview* do *Visual Studio Code*).

> **Uwaga:** Projekt wymaga połączenia z internetem, ponieważ dane o książkach są pobierane na żywo z API `wolnelektury.pl`.

## Opis podstron

### Strona główna (`index.html`)
Wyświetla siatkę polecanych książek ładowanych losowo z API. Zaimplementowany jest nieskończony scroll — kolejne książki (po 15 naraz) ładują się automatycznie, gdy użytkownik dotrze do dolnej krawędzi strony.

### Wyszukiwarka (`wyszukiwarka.html`)
Umożliwia wyszukiwanie książek po tytule oraz przeglądanie po filtrach: gatunkach, epokach i rodzajach. Wyniki są paginowane (15 pozycji na stronę). Parametry wyszukiwania i filtrów są przekazywane przez URL (`?zapytanie=`, `?filter=`, `?subfilter=`).

### Szczegóły książki (`ksiazka.html`)
Wyświetla szczegółowe informacje o wybranej książce: tytuł, autora, okładkę, epokę, rodzaj i gatunek. Kolor akcentu interfejsu dopasowuje się dynamicznie do koloru okładki książki. Zalogowany użytkownik może dodać książkę do koszyka.

### Koszyk (`koszyk.html`)
Wyświetla książki dodane do koszyka. Użytkownik może usunąć poszczególne pozycje lub wypożyczyć wszystkie naraz. Wypożyczenie wymaga zalogowania.

### Konto (`konto.html`)
Zawiera formularze logowania i rejestracji dla niezalogowanych użytkowników. Po zalogowaniu wyświetla informacje o koncie oraz listę wypożyczonych książek. Dostępne są opcje wylogowania i usunięcia konta.

## Funkcjonalności

### System kont
Dane użytkowników (loginy i hasła) oraz informacje o wypożyczeniach są przechowywane lokalnie w `localStorage` przeglądarki. Aktualnie zalogowany użytkownik jest identyfikowany kluczem `aktualnyUzytkownik`.

> **Uwaga:** Hasła są przechowywane w postaci jawnego tekstu. System kont ma charakter demonstracyjny i nie nadaje się do wdrożenia produkcyjnego.

### Motywy (jasny/ciemny)
Strona obsługuje jasny i ciemny motyw. Wybór motywu jest zapisywany w `localStorage` i przywracany przy każdym wejściu na stronę.

### Web Komponenty
Powtarzające się elementy interfejsu (nagłówek, nawigacja boczna, wyszukiwarka, powiadomienia) zostały zaimplementowane jako własne komponenty HTML (`<komponent-naglowek>`, `<komponent-nawigacja>`, `<komponent-wyszukiwarka>`, `<komponent-powiadomienia>`).

### Powiadomienia
Funkcja `pokazPowiadomienie(wiadomosc, typ)` wyświetla animowane powiadomienia w prawym górnym rogu ekranu. Obsługiwane typy to `"sukces"` (zielony akcent) i `"blad"` (czerwony akcent). Powiadomienia znikają automatycznie po 3 sekundach.