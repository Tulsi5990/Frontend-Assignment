// src/components/JsonEditor.js
import React, { useState } from 'react';
import './jsonEditor.css'; // Import the CSS file

const JsonEditor = ({ onSchemaChange }) => {
  const [schema, setSchema] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSchema(value);
    onSchemaChange(value);
  };

  return (
    <div className="json-editor-container">
      <h2>JSON EDITOR</h2>
      <textarea
        value={schema}
        onChange={handleInputChange}
        placeholder="Paste UI Schema here"
      />
    </div>
  );
};

export default JsonEditor;
