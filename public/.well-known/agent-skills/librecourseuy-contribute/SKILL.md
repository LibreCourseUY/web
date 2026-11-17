---
name: librecourseuy-contribute
description: Prepare a contribution to a LibreCourseUY repository: DCO sign-off, GPG-signed commits, Conventional Commits, and the pull request flow.
---

# Contributing to LibreCourseUY

Use this skill when a user wants to send a change to a LibreCourseUY project and
needs the project's exact requirements before opening a pull request.

## Before writing code

1. Pick a project with the `librecourseuy-project-catalogue` skill and confirm
   `open_to_contributions` is `true`.
2. Read the repository's own `CONTRIBUTING.md` and `README.md`; they win over
   this summary.
3. Ask the maintainer in Discord or on the issue tracker before starting work on
   anything larger than a typo.

## Hard requirements

Every LibreCourseUY repository enforces all three:

- **Developer Certificate of Origin**: every commit needs a `Signed-off-by`
  trailer. Produce it with `git commit -s`; never hand-write a name you are not
  entitled to sign for.
- **GPG-signed commits**: commits must be signed. See
  <https://librecourse.uy/docs/gpg-signature/> for key creation and Git config.
- **Conventional Commits**: `type(scope): summary`, for example
  `feat(ui): add org cards`.

Pull requests are rejected by CI when a commit lacks the sign-off; the check runs
on every pull request.

## Typical flow

```sh
git clone git@github.com:LibreCourseUY/<project>.git
cd <project>
git switch -c feat/short-description
# edit, then:
git add -p
git commit -s -m "feat(scope): short description"
git push -u origin feat/short-description
```

Open the pull request against the default branch, describe the change and the
motivation, and link any related issue.

## Constraints

- Do not rewrite published history to "fix" a missing sign-off unless the
  maintainer asks; a follow-up commit is usually acceptable.
- Never commit secrets, tokens, or personal data.
- Only contribute changes the user has the right to license under the target
  repository's licence.

## Where to ask

- Discord: <https://librecourse.uy/join/>
- Issue tracker: <https://gitsion.librecourse.uy/issues>
- DCO text: <https://librecourse.uy/dco/>
