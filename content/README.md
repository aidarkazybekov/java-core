# DevCore Content Vault

Single source of truth for all DevCore topic content. Open this folder directly in Obsidian.

- One markdown note per topic under `<track>/<NN-block>/<id>.md`, with a Russian mirror in `<NN-block>/ru/<id>.md`.
- `npm run compile-content` parses these notes into `src/data/content/*.ts` (generated, git-ignored).
- The build (`prebuild`/`predev`) runs the compiler automatically.
- Set `status: published` in a note's frontmatter to make missing RU/EN content a hard build error.
- `00-project/` is ignored by the compiler — use it for project notes.

New topics: copy `_templates/topic.md`.
