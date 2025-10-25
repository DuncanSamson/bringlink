# Bring Link
A URL Shortener Web App. It takes a long url like `https://example.com/really/really/long/url` and shortens it to `https://bringl.ink/V2Kp56I`.

## Status
[![Front End (Web) CI/CD](https://github.com/DuncanSamson/bringlink/actions/workflows/front-end.yml/badge.svg?branch=main)](https://github.com/DuncanSamson/bringlink/actions/workflows/front-end.yml)
[![Back End (API) CI/CD](https://github.com/DuncanSamson/bringlink/actions/workflows/back-end.yml/badge.svg?branch=main)](https://github.com/DuncanSamson/bringlink/actions/workflows/back-end.yml)

## Management
This project is managed via [kanban board](https://github.com/users/DuncanSamson/projects/2).

<img width="1450" height="480" alt="Screenshot 2025-10-25 at 22 05 56" src="https://github.com/user-attachments/assets/9b3e888a-4a7f-4fc3-9ae9-42e8d8c984d5" />

## Development

This project is made up for two workesr which are deployed to cloudflare workers and connect to a D1 Database.

- `web` is the front-end application and main website
- `api` is the back-end REST api.

### Coding Rules

Please follow [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) and :

1. Link each commit message to the related github issue eg. `#8 Add vitest to frontent`
2. Create feature branches using the format  `feature/#1-title-of-issue`
3. Create bugfix branches using the format  `fix/#1-title-of-issue`
4. Link a pull request to the related github issue eg `feature/#1-change-made`
5. Ensure that your changes come with tests (when applicable)
6. The test suite passes locally before making a PR.
7. Use the prettier linting rules provided, to comply to the style guide
