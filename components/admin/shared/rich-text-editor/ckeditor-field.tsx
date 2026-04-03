"use client"

import { useMemo } from "react"
import type { Batch } from "@ckeditor/ckeditor5-engine"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  Font,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  type Editor,
  type EditorConfig,
} from "ckeditor5"
import "ckeditor5/ckeditor5.css"
import { cn } from "@/lib/utils"

function wireFontBackgroundRemoveClearsHighlight(editor: Editor) {
  const bg = editor.commands.get("fontBackgroundColor")
  if (bg == null) return
  const run = bg.execute.bind(bg)
  bg.execute = (options?: { value?: string | null; batch?: Batch }) => {
    const normalized =
      options == null
        ? undefined
        : {
            batch: options.batch,
            value: options.value ?? undefined,
          }
    run(normalized)
    const v = options?.value
    if (v != null && v !== "") return
    const hi = editor.commands.get("highlight")
    if (hi?.isEnabled) {
      editor.execute("highlight")
    }
  }
}

export interface CKEditorFieldProps {
  readonly value: string
  readonly onChange: (html: string) => void
  readonly disabled?: boolean
  readonly className?: string
  readonly minHeight?: number
}

export function CKEditorField({
  value,
  onChange,
  disabled = false,
  className,
  minHeight = 240,
}: Readonly<CKEditorFieldProps>) {
  const config = useMemo<EditorConfig>(
    () => ({
      licenseKey: "GPL",
      plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Code,
        Subscript,
        Superscript,
        Link,
        List,
        TodoList,
        BlockQuote,
        CodeBlock,
        HorizontalLine,
        Image,
        ImageInsertViaUrl,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageTextAlternative,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties,
        MediaEmbed,
        Alignment,
        Indent,
        IndentBlock,
        Font,
        Highlight,
        PasteFromOffice,
        RemoveFormat,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersEssentials,
        Autoformat,
      ],
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "subscript",
          "superscript",
          "|",
          "link",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "outdent",
          "indent",
          "|",
          "alignment",
          "|",
          "insertImage",
          "|",
          "insertTable",
          "|",
          "blockQuote",
          "codeBlock",
          "horizontalLine",
          "|",
          "mediaEmbed",
          "|",
          "highlight",
          "|",
          "removeFormat",
          "|",
          "sourceEditing",
          "|",
          "specialCharacters",
        ],
        shouldNotGroupWhenFull: true,
      },
      heading: {
        options: [
          { model: "paragraph", title: "Đoạn văn", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Tiêu đề 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Tiêu đề 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Tiêu đề 3", class: "ck-heading_heading3" },
        ],
      },
      image: {
        toolbar: [
          "imageStyle:inline",
          "imageStyle:block",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "resizeImage",
        ],
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      fontBackgroundColor: {
        columns: 5,
        colors: [
          { color: "transparent", label: "Trong suốt", hasBorder: true },
          { color: "hsl(0, 0%, 0%)", label: "Black" },
          { color: "hsl(0, 0%, 30%)", label: "Dim grey" },
          { color: "hsl(0, 0%, 60%)", label: "Grey" },
          { color: "hsl(0, 0%, 90%)", label: "Light grey" },
          { color: "hsl(0, 0%, 100%)", label: "White", hasBorder: true },
          { color: "hsl(0, 75%, 60%)", label: "Red" },
          { color: "hsl(30, 75%, 60%)", label: "Orange" },
          { color: "hsl(60, 75%, 60%)", label: "Yellow" },
          { color: "hsl(90, 75%, 60%)", label: "Light green" },
          { color: "hsl(120, 75%, 60%)", label: "Green" },
          { color: "hsl(150, 75%, 60%)", label: "Aquamarine" },
          { color: "hsl(180, 75%, 60%)", label: "Turquoise" },
          { color: "hsl(210, 75%, 60%)", label: "Light blue" },
          { color: "hsl(240, 75%, 60%)", label: "Blue" },
          { color: "hsl(270, 75%, 60%)", label: "Purple" },
        ],
      },
    }),
    []
  )

  return (
    <div
      className={cn("[&_.ck-editor__editable]:min-h-[var(--ck-ed-mh)]", className)}
      style={{ ["--ck-ed-mh" as string]: `${minHeight}px` }}
    >
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value}
        disabled={disabled}
        onReady={(editor) => {
          wireFontBackgroundRemoveClearsHighlight(editor)
        }}
        onChange={(_event, editor) => {
          onChange(editor.getData())
        }}
      />
    </div>
  )
}
