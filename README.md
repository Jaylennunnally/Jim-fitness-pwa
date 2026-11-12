# JIM Fitness – PWA
Standalone home-screen app (dark navy / baby blue). Opens instantly from cache, refreshes data in the background.

Live: **https://jaylennunnally.github.io/Jim-fitness-pwa/** (GitHub Pages paths are case-sensitive – keep the capital **J**.)

No personal data, token, or spreadsheet id lives in this repo: the /exec link and token are typed on the phone and stored only in that phone's localStorage.

## Setup (one person)
1. Apps Script: replace Code.gs with Code.v2 (from JIM). In `setupToken()` replace `CHANGE-ME-...` with your own long random phrase, Save, choose **setupToken** in the Run menu, click **Run**.
2. Deploy → Manage deployments → pencil → Version: New version, **Who has access: Anyone** → Deploy. (Same /exec link.)
3. GitHub: Settings → Pages → Deploy from a branch → main / (root) → Save.
4. iPhone Safari: open https://jaylennunnally.github.io/Jim-fitness-pwa/ → Share → **Add to Home Screen** → open JIM from the icon → paste /exec link + token → Connect.

## Adding another person
Everyone uses the same app link, but each person gets their **own** tracker sheet, Apps Script deployment, and token. Never share one person's /exec link or token with someone else – it would show and edit that person's data.

Do **not** use File → Make a copy on an existing person's tracker. That would copy their food and weight data, and the script is tied to a specific spreadsheet id, so a copy can still point at the original sheet.

1. Create a new empty spreadsheet with the same tabs and headers (This Week, Food Log, Daily Log). Leave the logs empty.
2. Attach a fresh Apps Script pointed at **that new spreadsheet id**. Set a **new** token in `setupToken()` and run it, then Deploy → New deployment → Web app, access **Anyone**. This gives a new /exec link.
3. On their iPhone, open the app link above in Safari → Add to Home Screen → paste **their** /exec link + token → Connect.
4. To switch a phone to a different sheet, tap **Change connection** at the bottom of the dashboard. Connecting a new link clears the old cached data on that phone.

## Demo mode
Open `?demo=1` (e.g. https://jaylennunnally.github.io/Jim-fitness-pwa/?demo=1) to see the dashboard filled with fictional sample data from `demo.js`. Demo mode never contacts a sheet and never saves anything. Useful for screenshots.

Locally: `python3 -m http.server 8080` in this folder, then open http://localhost:8080/?demo=1.

## Updating
When you change any app file, bump the cache name in `sw.js` (`jim-shell-vN`) so installed phones pick up the new version.
