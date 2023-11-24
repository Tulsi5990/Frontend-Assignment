// src/components/JsonEditor.js
import React, { useState } from 'react';

const JsonEditor = ({ onSchemaChange }) => {
  const [schema, setSchema] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSchema(value);
    onSchemaChange(value);
  };

  return (
    <div style={{ width: '50%', padding: '20px' }}>
      <h2>JSON Editor</h2>
      <textarea
        value={schema}
        onChange={handleInputChange}
        placeholder="Paste UI Schema here"
        style={{ width: '100%', height: '80vh' }}
      />
    </div>
  );
};

export default JsonEditor;
