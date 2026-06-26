# BUILD SPEC — „Jeszcze Polska" (gra edukacyjna o historii Polski)

## Czym jest ten dokument
Specyfikacja techniczna do zbudowania przeglądarkowej, misyjnej gry o historii Polski
(966–1795), skupionej na terytorium zyskiwanym i traconym przez kolejne panowania.
W TEJ fazie budujemy **silnik + JEDNĄ kompletną misję (Misja 2 — Kazimierz Wielki)** jako
pionowy wycinek (vertical slice). Pozostałe cztery misje projektujemy jako dane/config, które
ten sam silnik wczyta później — NIE buduj ich teraz, ale NIE zakoduj niczego na sztywno, co by
je później blokowało.

Zbuduj maszynę + jedną dopracowaną misję. Sprawdź, czy jest grywalna i przyjemna. Poznaj
realny koszt jednej misji, zanim powstaną kolejne.

Pliki z treścią (osobne, dostarczone przez właściciela):
- `opis_gry` — fabuła + opis techniczny + metoda graficzna
- `mission_detailed_description` — pełny opis 5 misji (marginesy, ścieżka, postacie, easter egg)
- `dialogi_ludzi` — kwestie wszystkich klikalnych postaci, po polsku

CAŁA GRA JEST PO POLSKU (interfejs, dialogi, opisy).

---

## 1. Stos technologiczny i kształt projektu
- Czysty stack webowy: **HTML + CSS + vanilla JavaScript (moduły ES)**. Bez frameworków,
  bez kroku budowania. Ma działać po otwarciu index.html i hostować się na GitHub Pages.
- To prawdziwy lokalny projekt (nie artefakt Claude.ai), więc **localStorage jest dozwolony
  i oczekiwany** do zapisu postępu.
- Używaj **git** od pierwszego commita. Commit po każdym działającym etapie.
- Zasoby (grafika/dźwięk) trzymaj w osobnym folderze `/assets`, żeby dało się je podmieniać
  niezależnie od kodu.
- Kod w czytelnych, komentowanych modułach. Właściciel czyta JS, ale nie pisze od zera.

### Struktura folderów
```
/jeszcze-polska
  index.html
  /css/styles.css
  /js
    engine.js        # pętla gry, menedżer ekranów/scen, zapis/odczyt
    hub.js           # menu wyboru misji, śledzenie ukończenia
    mission.js       # ładuje config misji, prowadzi warstwę mapy
    tilemap.js       # renderuje mapę z kafelków (tile-based), siatka + warstwy
    player.js        # postać gracza (króla): ruch, kierunek, kolizje
    hotspots.js      # system hotspotów (budynki / NPC / znajdźki / jednostki)
    dialogue.js      # rozmowy (okna dialogowe NPC, portret + tekst)
    collect.js       # znajdźki + zbieranie
    build.js         # budowanie (stawianie struktur na hotspotach, koszt skarbca)
    combat.js        # OSOBNY moduł walki (uruchamiany przez misje bitewne)
    eggs.js          # globalny, trwały zbiór easter eggów + odblokowanie sekretnego końca
    state.js         # zapis/odczyt, flagi ukończenia, zbiór znalezionych eggów
  /missions
    m02_kazimierz.js # jedyna w pełni zbudowana misja (dane + ewentualna logika własna)
    # m01, m03, m04, m05 dodawane później — ten sam kształt
  /assets
    /tiles  /sprites  /portraits  /img  /audio
```

---

## 2. Architektura rdzenia (nośna — nie zmieniaj)

### Grafika: TILE-BASED (kafelki), styl retro GBA / Pokémon
- Świat NIE jest generowany jako jeden duży obraz. Mapa jest budowana z **kafelków** —
  małych, powtarzalnych obrazków (trawa, ścieżka, woda, mur, dach) układanych w siatce,
  dokładnie jak w klasycznym Pokémonie.
- Kafelki i sprite'y pochodzą z gotowych, darmowych zestawów (pliki w `/assets/tiles`
  i `/assets/sprites`). Silnik wczytuje arkusz kafelków (tileset / spritesheet) i renderuje
  z niego mapę wg tablicy indeksów. NIE rysuj grafiki w kodzie i NIE generuj jej.
- Rozmiar kafelka: przyjmij standard z dostarczonego zestawu (np. 16×16 lub 32×32 px),
  ze skalowaniem całości (np. ×2 lub ×3) dla czytelności.

### Mapa: widok z góry (top-down), poruszalny król
- Każda misja ma mapę kafelkową z **hotspotami** (klikalne/wchodzalne punkty).
- Hotspot może zawierać: **budynek**, **NPC**, **znajdźkę/egg** albo **jednostkę** (jednostki
  tylko w walce). Jeden system hotspotów, konfigurowany per misja.
- **Gracz steruje postacią króla** poruszającą się po mapie (klawisze strzałek / WASD).
  Interakcja przez zbliżenie się do hotspotu i naciśnięcie klawisza akcji (np. Spacja/Enter).
- Kolizje: król nie wchodzi w przeszkody (woda, mury, drzewa). Lekka kolizja oparta na
  mapie kafelków (które kafle są „blokujące").

### Plansza: mapa Polski z konturem granic (NOŚNE — serce gry)
- **Układ ekranu (OPCJA A — zatwierdzona):** ekran dzieli się na dwie strefy.
  - **Strefa główna (większa):** lokalna scena kafelkowa, po której CHODZI król — konkretne
    miejsce danej epoki (np. Kraków, plac budowy zamku), z budynkami, drzewami, NPC, hotspotami.
    To tu toczy się rozgrywka (chodzenie, rozmowy, budowanie, zbieranie). Klimat „pokémonowy".
  - **Panel boczny (mniejszy):** **mała mapa Polski z konturem granic** danej epoki —
    NIE chodzi się po niej; to wskaźnik. Razem z paskiem czasu tworzy panel postępu.
- Granica NIE jest statyczna. **W miarę postępu misji i posunięć gracza kontur granic na
  panelu bocznym zmienia kształt**, przyjmując właściwy, historyczny zarys ówczesnej Polski.
  Każdy osiągnięty kamień milowy (zbudowane miasto, wygrana bitwa, podpisana unia) animowanie
  przesuwa/rozszerza linię granicy ku jej docelowemu kształtowi dla tej epoki.
- Kluczowe: **lokalna scena (gdzie chodzi król) i kontur Polski (panel boczny) to dwie różne
  skale.** Król nie chodzi po mapie całego kraju — chodzi po lokalnej scenie, a jego dokonania
  przekładają się na zmianę konturu na panelu obok. To powiązanie (akcja w scenie → zmiana
  granicy w panelu) jest głównym sprzężeniem zwrotnym gry.
- Przykłady działania per misja:
  - Misja 1: z małego obszaru plemiennego kontur rozrasta się wraz z chrztem i koronacją.
  - Misja 2 (Kazimierz): kontur rozszerza się na południe i wschód, gdy stawiasz zamki
    i zakładasz miasta — „Polska z kamienia" rośnie na mapie bocznej.
  - Misja 4: kontur pęcznieje do ogromnego zarysu Rzeczypospolitej (unia z Litwą), potem
    sięga aż po Moskwę.
  - Misja 5: kontur **kurczy się** przy kolejnych rozbiorach, aż znika — panel staje się pusty.
- Technicznie: kontur granic to grafika/warstwa w panelu bocznym (np. linia SVG/wektor lub
  nakładka). Każda misja definiuje stan początkowy granicy i stan(y) docelowe; silnik animuje
  przejście między nimi przy osiąganiu milestone'ów. To główny wizualny wskaźnik postępu —
  działa w parze z bocznym paskiem czasu (oba w panelu bocznym).

### Czasowniki: modularne, włączane per misja
- Cztery czasowniki istnieją w silniku: **rozmowa, zbieranie, budowanie, walka**.
- Każdy config misji deklaruje, które są aktywne. Silnik pokazuje/ukrywa UI odpowiednio.
- Misja 2 (Kazimierz) włącza: rozmowa, zbieranie, budowanie. (walka WYŁ.)

### Walka: OSOBNY moduł (combat.js)
- Misje bitewne odpalają część mapową, a potem **uruchamiają combat.js jako pod-grę**, która
  działa wg własnych reguł (lekka walka jednostkami, turowa) i **zwraca wynik (wygrana/przegrana)**.
- W tej fazie tylko **zaślepka (stub)** z czystym interfejsem:
  `runCombat(config) -> Promise<{result: "won"|"lost", stats}>`. Kazimierz go nie wywołuje.

### Postęp: hub z zalecaną kolejnością
- **Menu wyboru misji** wymienia misje chronologicznie (zalecana ścieżka A→E), ale pozwala
  odpalić dowolną **odblokowaną** misję (np. od razu bitwę).
- Misje są **samodzielne**: każda ustawia własny stan startowy, NIE dziedziczy stanu końcowego
  poprzedniej. Hub śledzi tylko **flagi ukończenia**.

### Stan / trwałość
- Stan misji **resetuje się** przy każdym podejściu.
- Stan globalny (localStorage): flagi ukończenia + **zbiór znalezionych easter eggów**.
- Skompletowanie wszystkich eggów odblokowuje **sekretne zakończenie** (zarezerwuj hak; treść
  później).

### Pasek czasu (boczny)
- Każda misja ma boczny **pasek czasu** pokazujący marginesy epoki (np. 1333→1370) z
  zaznaczonymi kamieniami milowymi. Pełni podwójną rolę: kierunek epoki + licznik
  postępu/wyniku gracza. Wypełnia się wraz z osiąganiem kolejnych historycznych milestone'ów.

---

## 3. Szablon misji (każda misja ma ten kształt)
Osiem slotów rdzeniowych + trzy opcjonalne. Implementacja jako obiekt config + opcjonalna
funkcja logiki własnej (escape hatch).

SLOTY RDZENIOWE
1. **frame** — intro/cutscena (tekst + obraz; film osobno).
2. **objective** — cel pokazany graczowi.
3. **map** — tilemapa + lista hotspotów (typ, pozycja, zawartość).
4. **verbs** — które z: rozmowa/zbieranie/budowanie/walka są aktywne.
5. **winCondition** — deklaratywny, gdzie się da; może mieć **logikę własną**.
6. **npcs** — treść dialogów per hotspot-NPC (z pliku `dialogi_ludzi`).
7. **eggs** — easter eggi (każdy z globalnym id, by zapis był trwały).
8. **outcome** — zmiana mapy/granic po wygranej + tekst odznaki.

SLOTY OPCJONALNE (zarezerwowane; misja używa dowolnego podzbioru)
A. **refusal** — akcje, które misja blokuje z komunikatem-lekcją (np. zakazany najazd).
B. **pressure** — napięcie narracyjne (powracający NPC, konsekwencja na końcu). Domyślnie
   NIE zegar, lecz dramaturgia (misja MOŻE użyć zegara, jeśli zechce).
C. **rating** — opcjonalna ocena „jak dobrze ci poszło". Zarezerwowane, może być nieużyte.

---

## 4. Misja do zbudowania TERAZ — M02 Kazimierz Wielki
(Pełna treść w `mission_detailed_description`; dialogi w `dialogi_ludzi`. Skrót poniżej.)

- **marginesy:** 1333 (objęcie tronu) → 1370 (śmierć, koniec Piastów).
- **frame:** „Zastał Polskę drewnianą, a zostawił murowaną." Kraj zjednoczony, lecz z drewna.
- **objective:** Odbuduj królestwo — wznieś **3 kamienne zamki** i załóż **1 uniwersytet** —
  BEZ wojny.
- **map:** Polska poł. XIV w. + sąsiednie regiony. ~6 hotspotów: 3 miejsca pod zamek,
  1 miasto (Kraków → uniwersytet), 2 punkty NPC/egg. **Bydgoszcz** jako przykład zakładanego
  miasta (łączy się z sekcją o założeniu Bydgoszczy na stronie właściciela).
- **verbs:** rozmowa, zbieranie, budowanie. (walka WYŁ.)
- **winCondition:** 3 zamki + uniwersytet. *(logika własna: proste liczniki.)*
- **ekonomia (lekcja):** budowanie kosztuje **skarbiec**; uzupełniasz go **rozmową** z kupcami
  i **zbieraniem** premii ze szlaków handlowych. Wzrost przez gospodarkę i prawo, nie podbój.
- **refusal:** hotspot „najedź sąsiada" — kliknięcie KOŃCZY się odmową: żołnierz mówi
  „Król nie chce wojny, panie." Odmowa JEST lekcją.
- **pressure (narracja, BEZ zegara):** doradca powraca z kwestią sukcesji („Panie, a co po
  tobie?"). Buduje sens budowania rzeczy, które cię przetrwają. Karta końcowa: korona przechodzi
  poza ród Piastów — wygrana misja, która kończy się cichą stratą. NIE pogania gracza.
- **npcs (rozmowa):** architekt, krakowski kupiec, żydowski osadnik, Jan Kiesselhuth i Konrad
  (zasadźcy Bydgoszczy), Ludwik Węgierski. (Kwestie w `dialogi_ludzi`.)
- **eggs (zbieranie, trwałe globalnie):** koń przy bramie zamku → kopnięciem wytrąca monetę
  (premia + żart). (Plus zostaw miejsce na kolejne.)
- **outcome:** granice rozszerzają się na S/E; tekstura „kamienia" rozlewa się na miasta.
  Odznaka: „Zastał drewnianą, zostawił murowaną."

---

## 5. Kolejność budowania (vertical slice — rób w tej sekwencji, commituj każdy krok)
1. **Szkielet:** index.html, menedżer scen w engine.js, hub.js z 5 kafelkami misji
   (4 zablokowane/stub), state.js z zapisem localStorage. Klik w Kazimierza otwiera pustą scenę misji.
2. **Tilemapa + król + panel boczny:** tilemap.js renderuje lokalną scenę Kazimierza z
   wczytanego zestawu kafelków; player.js — król chodzi (strzałki/WASD) z kolizjami. Dodaj
   panel boczny z miejscem na mapę-kontur Polski (na razie placeholder) + pasek czasu.
3. **Hotspoty:** klikalne/wchodzalne punkty; zbliżenie + akcja loguje typ hotspotu.
4. **Rozmowa:** dialogue.js — okno dialogowe z portretem + tekstem. Podłącz NPC z `dialogi_ludzi`.
5. **Budowanie + ekonomia:** build.js + skarbiec. Stawianie zamków/uniwersytetu, koszty,
   logika licznika wygranej.
6. **Zbieranie + eggi:** collect.js + eggs.js — egg z koniem, globalny trwały zbiór.
7. **Refusal + pressure:** zablokowany najazd; kwestia sukcesji doradcy; karta końcowa.
8. **Outcome + wygrana:** animowana zmiana konturu granic na panelu bocznym (Polska rośnie
   na S/E), tekstura „kamienia" rozlewa się na miasta w scenie, odznaka, oznaczenie misji
   jako ukończonej. Granica na panelu zmienia się stopniowo przy każdym milestone, nie tylko
   na końcu.
9. **combat.js stub** z interfejsem runCombat (bez treści), by misje bitewne dało się podłączyć później.
10. Szlif; potwierdź, że działa po otwarciu index.html.

Tam, gdzie brak docelowej grafiki, używaj **wyraźnie oznaczonych placeholderów** (kafel
w jednolitym kolorze z etykietą), by właściciel mógł podmienić zasoby plikami w `/assets`.

## 6. Wyraźnie POZA zakresem tej fazy
- Misje 1, 3, 4, 5 (w hubie tylko stub/zablokowane kafelki).
- Realna treść walki (tylko interfejs-zaślepka).
- Docelowa grafika i dźwięk (placeholdery; właściciel wgra kafelki i portrety).
- Treść sekretnego zakończenia (tylko hak odblokowania + śledzenie eggów).
