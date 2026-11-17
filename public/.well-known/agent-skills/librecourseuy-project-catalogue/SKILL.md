---
name: librecourseuy-project-catalogue
description: Search the LibreCourseUY open source catalogue by category, language, tag or contribution status, using the public JSON feed or the site MCP tools.
---

# LibreCourseUY project catalogue

Use this skill when a user asks what the LibreCourseUY community is building,
wants an open source project to contribute to, or needs project metadata
(repository, licence, language, maintainers, contribution status).

## When to use it

- "Find a Python project I can contribute to."
- "Which LibreCourseUY projects are open source?"
- "What does the LibreCourseUY catalogue contain?"

For contribution mechanics (sign-off, GPG, pull requests) use the
`librecourseuy-contribute` skill instead.

## Data sources

| Source         | URL                                | Notes                                                        |
| -------------- | ---------------------------------- | ------------------------------------------------------------ |
| Catalogue feed | `https://librecourse.uy/api/feed`  | JSON, edge-cached 5 minutes, no auth                         |
| MCP endpoint   | `https://librecourse.uy/mcp`       | Streamable HTTP, tools `search_projects` and `get_site_page` |
| Human page     | `https://librecourse.uy/projects/` | Same data, rendered                                          |

## Feed shape

`GET /api/feed` returns:

```json
{
  "categories": ["Web", "APIs", "Mobile", "Desktop", "CLI Tools"],
  "orgs": [{ "name": "LibreCourseUY", "url": "https://github.com/LibreCourseUY" }],
  "entries": [
    {
      "name": "audit-log-microservice",
      "url": "https://github.com/LibreCourseUY/audit-log-microservice",
      "description": "Microservice for centralized audit logging.",
      "category": "APIs",
      "tags": [],
      "language": [],
      "maintainers": [],
      "license": "MIT",
      "commercial": false,
      "repository": "https://github.com/LibreCourseUY/audit-log-microservice",
      "open_to_contributions": true,
      "relationship": "official",
      "open_source": true
    }
  ]
}
```

## How to search

1. Fetch the feed once, then filter locally — do not poll it per query.
2. Match `query` against `name`, `description`, `tags`, `category` and
   `maintainers`, case-insensitively.
3. Filter on `category`, `language`, `commercial` or `open_to_contributions` as
   needed.
4. Prefer entries where `open_to_contributions` is `true` when the user wants to
   get involved.
5. Always cite the project `url` you return.

`language` and `maintainers` are often empty arrays: absence means "not
recorded", not "none".

## Constraints

- Read-only: do not attempt to write to the catalogue.
- The feed has no pagination and no query parameters; fetch and filter.
- Do not invent stars, activity dates, or popularity: the feed does not carry them.
