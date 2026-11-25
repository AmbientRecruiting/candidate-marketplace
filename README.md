# Ambient Recruiting – Candidate Marketplace (interim)

Anonymized candidate catalog for Ambient Recruiting, published with GitHub Pages:
https://ambientrecruiting.github.io/candidate-marketplace/

Profiles are posted and maintained automatically by Power Automate. Nothing in this repo should be edited by hand except site design changes or removing a candidate.

## How it works
- **Resume flow (Power Automate):** after a candidate profile is generated and passes QC, the flow saves two files in `profiles/`:
  - `{CandidateID}.json`: the card data (format below)
  - `Candidate Resume - {CandidateID}.pdf`: the anonymized profile PDF
- **Marketplace Status Sync (Power Automate, daily at 6:40 AM ET):** reads each listed candidate's Bullhorn status and Candidate Marketplace field, then:
  - Candidate Marketplace = No → removes the profile
  - Risk, Inactive, Suspended, DNA, Archive → removes the profile
  - Placed, Hired In → HIRED stamp (`"status": "Hired"` plus `hiredDate`); removed 30 days later
  - New Lead, In Progress, Ready to Place, Submitted to Client → stays (stamp removed if it had one)
  - Any other status → no change; listed in the daily email to automations@ambientrecruiting.com
- **Publishing:** every push to `main` runs `.github/workflows/deploy.yml`, which builds the site from `site/` and `profiles/` and pushes the result to the `gh-pages` branch. GitHub Pages serves the `gh-pages` branch (Settings → Pages → Deploy from a branch → `gh-pages` / root). A daily rebuild keeps "New" badges and hire dates current.

## Repo layout
| Path | What it is |
|---|---|
| `site/index.html` | The whole site: layout, styles, search, filters, sorting, pagination |
| `site/assets/` | Logos, favicon, and Apple touch icon |
| `scripts/build.mjs` | Builds the site and the candidate list (`data/candidates.json`) from `profiles/` |
| `profiles/` | One JSON file and one PDF per listed candidate (managed by the flows) |
| `.github/workflows/deploy.yml` | Build and publish workflow |
| `gh-pages` branch | Generated output. Never edit it directly. |

## Profile JSON format
```json
{
  "id": "523076",
  "headline": "Material Handler",
  "category": "Manufacturing & Production",
  "categories": ["Manufacturing & Production", "Administrative"],
  "branch": "Traverse City",
  "workArea": "Traverse City, MI",
  "employmentType": "Part-Time",
  "shift": "1st Shift",
  "desiredPay": "$20/hr",
  "workPreference": "Warehouse & Fulfillment",
  "education": "High School Diploma",
  "summary": "…",
  "qualifications": ["Forklift Operation", "…"],
  "recruiter": { "name": "", "title": "", "phone": "", "email": "" },
  "status": "Available",
  "postedDate": "2026-11-24",
  "hiredDate": "2026-11-30",
  "pdf": "Candidate Resume - 523076.pdf"
}
```
Only `id` is required. `hiredDate` is added by the status sync when a candidate is stamped hired.

## Site features
- Search across every posted field, with synonyms (e.g., hi-lo = forklift, nights = 3rd shift) and typo tolerance. Synonym groups are in the `SYNONYMS` list in `site/index.html`.
- Filters panel (Category, Employment Type, Shift, Branch, Work Area), sort menu (date added, pay, role A–Z), Hide hired switch, 20 candidates per page.
- Hired candidates show by default in gold with a HIRED ribbon and "Hired X days after posting."

## Removing a candidate manually
Delete both the candidate's `.json` file and PDF from `profiles/`. Avoid committing while a flow is running (simultaneous saves can cause a GitHub "Conflict" error).

## Privacy
This repo and site are public. Profiles must stay anonymized: no candidate names, personal contact info, street addresses, employer or school names, or employment dates. Deleted files remain in the repo's Git history. If a non-anonymized profile is ever posted, it must be purged from history, not just deleted. See the project's Security Review for details.

Questions: the Automations Team at automations@ambientrecruiting.com.
