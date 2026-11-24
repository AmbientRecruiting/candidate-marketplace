# Ambient Recruiting – Candidate Marketplace (interim)

Anonymized candidate catalog published with GitHub Pages. The resume flow (Power Automate) posts each approved profile here.

## How it works
- Each candidate is two files in `profiles/`:
  - `{CandidateID}.json` – the card data (format below)
  - `Candidate Resume - {CandidateID}.pdf` – the anonymized profile PDF
- Every push to `main` runs `.github/workflows/deploy.yml`, which builds the candidate list from `profiles/` and publishes the site. A daily rebuild keeps "New" badges current.
- To remove a candidate: delete both files, or set `"status": "Withdrawn"`.
- To mark hired: set `"status": "Hired"` (shows a HIRED stamp; hidden unless "Show hired" is checked).
- Optional auto-hide: set `HIDE_AFTER_DAYS` in the workflow (0 = off). Hidden profiles stay in the repo.

## Profile JSON format
```json
{
  "id": "523076",
  "headline": "CNC Machine Operator",
  "category": "Manufacturing & Production",
  "branch": "Traverse City",
  "workArea": "Traverse City, MI",
  "employmentType": "Full-Time",
  "shift": "1st Shift",
  "schedule": "",
  "desiredPay": "$19–$21/hr",
  "workPreference": "",
  "summary": "",
  "qualifications": ["...", "..."],
  "recruiter": { "name": "", "title": "", "phone": "", "email": "" },
  "status": "Available",
  "postedDate": "2026-11-24",
  "pdf": "Candidate Resume - 523076.pdf"
}
```
Only `id` is required. Blank fields show as "—".

## Branding
Brand colors are CSS variables at the top of `site/index.html`; replace them with the exact brand-kit hex values. Add a logo at `site/assets/logo.png` (white or light version, shown on the teal header).

## Privacy
Profiles must be anonymized before posting: no candidate names, personal contact info, addresses, employer names, or dates. This repo and site are public.
