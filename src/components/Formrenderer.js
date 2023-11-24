import React from 'react';
import Form from 'react-jsonschema-form';

const FormRenderer = ({ uiSchema }) => {
  return (
    <div>
      <h2>Form Renderer</h2>
      <Form
        schema={{}}
        uiSchema={uiSchema}
        onSubmit={(formData) => console.log('Form data:', formData)}
      />
    </div>
  );
};

export default FormRenderer;
