import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { Box, useTheme } from '@mui/material';

interface SectionEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function SectionEditor({ content, onChange }: SectionEditorProps) {
  const theme = useTheme();
  const editorRef = useRef<any>(null);
  
  // Configure editor based on theme
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        '& .tox-tinymce': {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        },
        minHeight: 500,
      }}
    >
      <Editor
        apiKey="7a7eomzmbzntjw2j8is7v1rutx6an1tvrrckm0ciknkrn1ai"
        onInit={(evt: any, editor: any) => {
          editorRef.current = editor;
        }}
        value={content}
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 
            'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Premium features
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 
            'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 
            'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 
            'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          content_style: `
            body { 
              font-family: ${theme.typography.fontFamily}; 
              font-size: 16px; 
              color: ${theme.palette.text.primary}; 
              background-color: ${theme.palette.background.paper};
            }
          `,
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          // Simplified image upload handler without promises
          images_upload_url: '/api/upload-image',
          automatic_uploads: true
        }}
      />
    </Box>
  );
}