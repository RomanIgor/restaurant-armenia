# Deploy pe Strato – Restaurant Armenia

## Situatia curenta

- **Domeniu principal:** restaurant-armenia.de → server Hetzner (IP 78.47.141.211) — siteul vechi WordPress
- **Subdomain de test:** test.restaurant-armenia.de → Strato webspace (`/new/` folder) — siteul nou
- **Strato webspace:** platit de client (~18€/luna), folosit doar pentru testare pana la migrare finala

---

## 1. Creare subdomain pe Strato

1. Logheaza-te la **Strato Kundenlogin** → My Strato
2. Mergi la **Domains** → selecteaza `restaurant-armenia.de`
3. Click pe **Subdomains** → **Subdomain anlegen**
4. Scrie: `test` → confirma
5. Dupa creare, click pe subdomain-ul `test.restaurant-armenia.de` → **Einstellungen**
6. La sectiunea **Zielverzeichnis / Weiterleitung** alege optiunea **Intern**
7. In campul de cale scrie: `/new`
8. Salveaza — dureaza cateva minute pana se activeaza

---

## 2. Creare folder pe Strato via FileZilla (SFTP)

### Deschide FileZilla
Calea: `C:\Program Files\FileZilla FTP Client\filezilla.exe`

### Configureaza conexiunea (Site Manager)
1. In FileZilla: **File** → **Site Manager** (sau `Ctrl+S`)
2. Click **New Site** → denumeste-l `Strato Armenia`
3. Completeaza:
   - **Protocol:** `SFTP – SSH File Transfer Protocol`
   - **Host:** `ssh.strato.de`
   - **Port:** `22`
   - **Logon Type:** `Normal`
   - **User:** adresa de email Strato (ex. `kontakt@restaurant-armenia.de`)
   - **Password:** parola contului Strato
4. Click **Connect**

> **Important:** Trebuie sa selectezi explicit protocolul **SFTP** (nu FTP simplu pe port 21)!

### Creaza folderul `/new`
1. Dupa conectare, in panoul din dreapta (server) esti in directorul radacina
2. Click dreapta → **Create directory** → scrie `new` → OK

---

## 3. Incarca fisierele siteului

### Structura de fisiere care trebuie incarcata in `/new`:
```
new/
├── index.html
├── send_mail.php
├── css/
│   └── style.css
├── js/
│   └── main.js
├── restaurants_images/
│   └── r01.jpeg, r02.jpeg, ... r15.jpeg
├── food_iamges_variant2/
│   └── f01.jpeg, f02.jpeg, ...
├── Veranstaltungen/
│   └── v01.jpeg, v02.jpeg, ...
├── eltern_new_version.png
├── Garik.jpeg
├── gutschein_new_version.png
└── (alte imagini necesare)
```

### Cum se incarca:
1. In FileZilla, panoul **stanga** = calculatorul tau local → naviga la `C:\rest_armenia`
2. Panoul **dreapta** = serverul Strato → naviga la `/new`
3. Selecteaza fisierele/folderele → trage (drag & drop) din stanga in dreapta
4. Pentru mai multe fisiere: `Ctrl+A` pentru a selecta tot, sau `Ctrl+Click` pentru selectie multipla

---

## 4. Versiunea PHP pe Strato

Strato foloseste **PHP 5.3 Extended Support** — cod PHP trebuie sa fie compatibil:
- Nu se foloseste operatorul `??` (null coalescing) — se inlocuieste cu `isset() ? : `
- Nu se foloseste `http_response_code()` — se inlocuieste cu `header('HTTP/1.1 400 Bad Request')`

Setare PHP in Strato panel: **Hosting** → **PHP-Version** → `5.3 Extended Support`

---

## 5. Testare

- URL de test: **http://test.restaurant-armenia.de**
- Nu are SSL (certificatul Strato gratuit nu acopera subdomain-uri custom)
- Testeaza pe **Chrome desktop** (nu mobile) pentru a evita avertismentul "Nicht sicher"

---

## 6. Migrare finala (cand siteul e gata)

Cand siteul nou este aprobat de client:
1. Incarca toate fisierele din `/new` in directorul **radacina** (`/`) pe Strato
2. Schimba A record-ul domeniului `restaurant-armenia.de` de la IP-ul Hetzner (78.47.141.211) la IP-ul Strato
3. Sau: muta complet hostingul pe Strato si anuleaza Hetzner

---

*Document creat: Aprilie 2026*
