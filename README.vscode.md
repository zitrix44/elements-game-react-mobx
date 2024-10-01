# Recomended extensions
- ~~[Table Editor `sswatson.table-editor`](https://marketplace.visualstudio.com/items?itemName=sswatson.table-editor) A spreadsheet-style editor for CSV, JSON, and Markdown tables~~
- [Rainbow CSV `mechatroner.rainbow-csv`](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) Highlight CSV and TSV files, Run SQL-like queries
- [TODO Highlight `wayou.vscode-todo-highlight`](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight) Highlight TODOs, FIXMEs, and any keywords, annotations...

# settings.json example

```json
  "todohighlight.keywords": [
    {
      "text": "TODO:",
      "color": "#777",
      "backgroundColor": "#ef3",
    },
    {
      "text": "FIXME:",
      "color": "#eef",
      "backgroundColor": "#e66",
      "outline": "30px solid #f662",
      "borderRadius": "3px"
    },
    {
      "text": "NOTE:",
      "color": "#fff",
      "backgroundColor": "#99f",
      "isWholeLine": false
    }
  ],
  "todohighlight.defaultStyle": {
    "fontWeight": "700",
    "border": "1px solid #ffffff66",
  },

```