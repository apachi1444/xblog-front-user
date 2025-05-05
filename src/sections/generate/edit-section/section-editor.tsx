import type { EditorOptions } from "@tiptap/core";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, forwardRef, useCallback, useEffect } from "react";
import {
  MenuDivider,
  insertImages,
  RichTextEditor,
  MenuButtonBold,
  MenuButtonRedo,
  MenuButtonUndo,
  MenuButtonItalic,
  MenuSelectHeading,
  MenuButtonEditLink,
  MenuButtonSubscript,
  MenuControlsContainer,
  MenuButtonOrderedList,
  MenuButtonImageUpload,
  type RichTextEditorRef,
  RichTextEditorProvider,
  MenuButtonBulletedList,
  MenuButtonHorizontalRule
} from "mui-tiptap";

import { Box } from "@mui/material";

import useExtensions from "./useExtensions";

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const Editor = forwardRef<RichTextEditorRef, EditorProps>(({
  initialContent = "<p>Start writing here...</p>",
  onChange
}, ref) => {
  const rteRef = useRef<RichTextEditorRef>(null);
  const [showMenuBar] = useState(true);
  const [content, setContent] = useState(initialContent);

  // Update content when initialContent changes
  useEffect(() => {
    console.log('initialContent changed in Editor component:', initialContent);
    if (initialContent) {
      console.log('Updating editor content from initialContent:', initialContent);
      setContent(initialContent);
      if (rteRef.current?.editor) {
        console.log('Setting editor content via commands.setContent');
        rteRef.current.editor.commands.setContent(initialContent);
      } else {
        console.log('Editor reference not available yet');
      }
    } else {
      console.log('initialContent is empty or undefined');
    }
  }, [initialContent]);

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
      });
    },
    []
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (_view, event, _slice) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  // Set up editor with content change handler
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "<p>Start writing your section content here...</p>",
    onUpdate: ({ editor: editore }) => {
      if (onChange) {
        const newContent = editore.getHTML();
        console.log('Editor content updated in section-editor.tsx:', newContent);
        onChange(newContent);
      }
    },
    editorProps: {
      handleDrop,
      handlePaste,
    }
  }, [initialContent]);

  // Log when editor is created or updated
  useEffect(() => {
    if (editor) {
      console.log('Editor instance created/updated');
      console.log('Current editor content:', editor.getHTML());
    }
  }, [editor]);

  // Add a direct input handler to ensure we catch all content changes
  useEffect(() => {
    if (!editor || !onChange) return;

    const handleInput = () => {
      const newContent = editor.getHTML();
      console.log('Direct input handler triggered, content:', newContent);
      onChange(newContent);
    };

    // Add event listener to the editor DOM element
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('input', handleInput);
      // eslint-disable-next-line consistent-return
      return () => {
        editorElement.removeEventListener('input', handleInput);
      };
    }
  }, [editor, onChange]);

  const extensions = useExtensions({
    placeholder: "Start writing your content here...",
  });

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        "& .ProseMirror": {
          minHeight: '300px',
          padding: 2,
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            scrollMarginTop: showMenuBar ? 50 : 0,
          },
        },
      }}
    >
      <RichTextEditorProvider editor={editor}>
        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          // Don't set content here, it's already set in the useEditor hook
          onBlur={() => {
            if (editor && onChange) {
              const newContent = editor.getHTML();
              console.log('Editor blurred, content:', newContent);
              onChange(newContent);
            }
          }}
          renderControls={() => (
            <MenuControlsContainer>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <MenuButtonSubscript />
              <MenuButtonEditLink />
              <MenuDivider />
              <MenuButtonOrderedList />
              <MenuButtonBulletedList />
              <MenuDivider />
              <MenuButtonImageUpload
                onUploadFiles={(files) =>
                  files.map((file) => ({
                    src: URL.createObjectURL(file),
                    alt: file.name,
                  }))
                }
              />
              <MenuDivider />
              <MenuButtonHorizontalRule />
              <MenuButtonUndo />
              <MenuButtonRedo />
            </MenuControlsContainer>
          )}
        />
      </RichTextEditorProvider>

    </Box>
  );
});

Editor.displayName = 'Editor';
