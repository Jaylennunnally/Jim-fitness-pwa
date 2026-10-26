# JIM Fitness – PWA
Standalone home-screen app (dark navy / baby blue). Opens instantly from cache, refreshes data in the background.
No personal data or token lives in this repo: the /exec link and token are typed on the phone and stored only in that phone's localStorage.

## Setup
1. Apps Script: replace Code.gs with Code.v2 (from JIM). In `setupToken()` replace `CHANGE-ME-...` with your own long random phrase, Save, choose **setupToken** in the Run menu, click **Run**.
2. Deploy → Manage deployments → pencil → Version: New version, **Who has access: Anyone** → Deploy. (Same /exec link.)
3. GitHub: Settings → Pages → Deploy from a branch → main / (root) → Save.
4. iPhone Safari: open https://jaylennunnally.github.io/jim-fitness-pwa/ → Share → **Add to Home Screen** → open JIM from the icon → paste /exec link + token → Connect.
