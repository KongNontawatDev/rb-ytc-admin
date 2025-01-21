import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { EventInfo } from '@ckeditor/ckeditor5-utils';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Import additional image upload plugins
import '@ckeditor/ckeditor5-image/theme/image.css';

// Define props interface for type safety
interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  imageUploadUrl?: string; // Optional prop for custom upload URL
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Start typing...',
  readOnly = false,
  imageUploadUrl = '/upload' // Default upload endpoint
}) => {
  const [editorContent, setEditorContent] = useState<string>(initialContent);

  const handleEditorChange = (_: EventInfo<string, unknown>, editor: ClassicEditor) => {
    const data = editor.getData();
    setEditorContent(data);
    
    // Call onChange prop if provided
    if (onChange) {
      onChange(data);
    }
  };

  // CKEditor configuration with image upload
  const editorConfig = {
    placeholder: placeholder,
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      '|',
      'imageUpload',
      '|',
      'undo',
      'redo'
    ],
    
    // Image upload configuration
    image: {
      toolbar: [
        'imageTextAlternative', // Alt text
        'toggleImageCaption',   // Toggle caption
        'imageStyle:inline',    // Inline image
        'imageStyle:block',     // Block image
        'imageStyle:side'       // Side image
      ],
      upload: {
        types: ['png', 'jpeg', 'gif', 'jpg', 'webp']
      }
    },
    
    // Custom upload adapter configuration
    cloudServices: {
      uploadUrl: imageUploadUrl
    }
  };

  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={editorContent}
        onChange={handleEditorChange}
        disabled={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;