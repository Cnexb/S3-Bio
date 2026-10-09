# Biology content packs

This repo is the Biology teaching files for **Uni+ (All-In-One)**. Students do not open this site. Uni+ reads the `content-packs/` folder and shows labs, comics, and quizzes in Learning Tools.

## How Uni+ finds content

Each **Uni+ topic** from the Biology topic list is one folder. Uni+ only looks **one level** under `content-packs/`:

```
content-packs/
  bb01-introduction-to-biology/
  bb02-molecules-of-life/
    manifest.json
    quiz/bb02-1/           ← AIO quiz list (quizId + topicCode, Physics shape)
    tools/<slug>/index.html
    tools/shared/          ← one copy of embed, draw tool, and quiz helpers
    tools/s3-mc/           ← one In Class Test bank (BB02–BB06, SB01, SB02)
  bb03-cellular-organization/
  bb04-membrane-transport/
  bb05-metabolism-and-enzymes/
  bb06-personal-health-and-diseases/
```

`manifest.json` is the table of contents. **A file that is not listed there is invisible** in Uni+.

Do **not** wrap topics in year folders such as `content-packs/S3/…`. Uni+ will not see them.

## S3–S6 is a label on a Topic, not a folder

The syllabus list is `content/topics/bio-topics.json`. Each Topic has:

- a **Symbol**, e.g. `BB02`, `SB01`
- a **Level**, e.g. `(S3)` or `(S3/S4)`
- **Sub-topics** where the sheet lists them

This branch publishes S3 topics `BB01` through `BB06`. `BB01` is listed so All-In-One shows the topic; it has no labs or quiz items yet. `SB02` stays in the In Class Test bank until it has its own pack. Later years stay in the syllabus until their files are added. Do not invent Symbols.

## Shared topics across forms

Column L in the topic list highlights two groups in blue and green. Each group is one topic taught in both Basic Biology and Senior Biology. The files live once, under `bb02-molecules-of-life`. A quiz about either group is tagged with **both** `BB02` and `SB01`.

| Highlight | Same topic | Symbols |
| --- | --- | --- |
| Blue | BB02 2.1–2.7 (molecules of life) and SB01 1.1 Food requirements of humans | `BB02`, `SB01` |
| Green | BB02 2.8 Tests for biomolecules and SB01 1.2 Summary of food tests | `BB02`, `SB01` |

`sharedGroups` in `bio-topics.json` is the list to use when a quiz needs more than one topic tag. Do not copy the Food Test Lab or the S3 question bank into a second folder.

The S3 multiple-choice bank covers BB02–BB06, SB01, and SB02. The interactive page lives once in `bb02-molecules-of-life/tools/s3-mc`. Each BB02–BB06 subtopic is also listed under that pack’s `quiz/` folder (same `quizId` / `section` / `question_id` as the tracker), like Physics `quiz/jphg01-1`.

## What teachers edit

| You want to change | Edit |
| --- | --- |
| Which items appear | that topic’s `manifest.json` |
| A lab, comic, or quiz page | `tools/<slug>/` (keep `index.html`) and the `tools` list |
| Topic codes / year | `content/topics/bio-topics.json` |

Cursor follows `.cursor/rules/bio-content-packs.mdc`.
