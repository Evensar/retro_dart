# 🎯 Retrospektiv Måltavla

En interaktiv webbapplikation för team-retrospektiv där deltagare kan placera markörer på en måltavla för att reflektera över olika mål och aktiviteter.

## ✨ Funktioner

- **Interaktiv måltavla**: Klicka för att placera markörer med olika poäng (1-8)
- **Målhantering**: Skapa och hantera mål/aktiviteter
- **Deltagare**: Hantera teammedlemmar med unika färger
- **Export**: Exportera resultat till PDF eller PNG
- **Responsiv design**: Fungerar på desktop, tablet och mobil
- **Realtidsuppdateringar**: Alla deltagare ser ändringar direkt

## 🚀 Snabbstart

### Lokal utveckling

1. **Klona projektet**
   ```bash
   git clone https://github.com/[ditt-användarnamn]/retro-target.git
   cd retro-target
   ```

2. **Installera dependencies**
   ```bash
   npm install
   ```

3. **Starta utvecklingsserver**
   ```bash
   npm run dev
   ```

4. **Öppna i webbläsaren**
   ```
   http://localhost:5173
   ```

### Produktionsbuild

```bash
npm run build
```

## 📦 Deployment till GitHub Pages

### Automatisk deployment (Rekommenderat)

1. **Pusha koden till GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Aktivera GitHub Pages**
   - Gå till ditt repository på GitHub
   - Klicka på "Settings" → "Pages"
   - Under "Source" välj "GitHub Actions"
   - Workflow kommer automatiskt att köras vid varje push

3. **Din app kommer att vara tillgänglig på:**
   ```
   https://[ditt-användarnamn].github.io/retro-target
   ```

### Manuell deployment

1. **Installera gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Deploya**
   ```bash
   npm run deploy
   ```

## 🛠️ Teknisk stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build tool**: Vite
- **Icons**: Lucide React
- **PDF export**: jsPDF
- **State management**: React Context API

## 📝 Användning

1. **Som facilitator**:
   - Skapa mål och aktiviteter
   - Hantera deltagare
   - Dela länk med teamet
   - Exportera resultat

2. **Som deltagare**:
   - Välj färg och namn
   - Klicka på "Lägg till markör" under varje mål
   - Välj poäng (1-8) och färg
   - Klicka på måltavlan för att placera markören

## 🎨 Anpassning

Du kan enkelt anpassa:
- **Färger**: Redigera `PREDEFINED_COLORS` i `src/types/index.ts`
- **Poäng**: Ändra `SCORE_OPTIONS` i `src/types/index.ts`
- **Styling**: Modifiera Tailwind-klasser i komponenterna

## 📄 Licens

MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🤝 Bidrag

Bidrag är välkomna! Skapa en fork, gör dina ändringar och skicka en pull request.

## 📞 Support

Om du stöter på problem, skapa en issue på GitHub eller kontakta utvecklaren.