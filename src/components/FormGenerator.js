import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';

const recursiveRender = (fields, currentTab = null, selectedPizzaType = null) => {
  let acc = {};

  fields.forEach(field => {
    if (field.uiType === 'Group') {
      const groupFields = field.subParameters ? recursiveRender(field.subParameters, currentTab, selectedPizzaType) : {};
      acc[field.jsonKey] = {
        type: 'object',
        properties: groupFields.properties,
      };
    } else if (field.uiType === 'Radio') {
      acc[field.jsonKey] = {
        type: 'string',
        title: field.label,
        enum: field.validate.options.map(option => option.value),
        enumNames: field.validate.options.map(option => option.label),
        // Added uiType and radioType for rendering radio buttons
        uiType: 'Radio',
        radioType: field.uiType,
      };
    } else if (field.uiType === 'Ignore' && field.conditions) {
      const condition = field.conditions.find(cond => cond.action === 'enable');
      if (condition && condition.value === currentTab) {
        const ignoreGroupFields = field.subParameters ? recursiveRender(field.subParameters, currentTab, selectedPizzaType) : {};
        acc[field.jsonKey] = {
          type: 'object',
          properties: ignoreGroupFields.properties,
        };
      }
    } else if (field.uiType === 'Input') {
      acc[field.jsonKey] = { type: 'string', title: field.label };
    } else if (field.uiType === 'Select' || field.jsonKey === 'slices') {
      acc[field.jsonKey] = {
        type: 'string',
        title: field.label,
        enum: field.validate.options.map(option => option.value),
        enumNames: field.validate.options.map(option => option.label),
      };
    }
  });

  return {
    type: 'object',
    properties: acc,
  };
};


const FormGenerator = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});

  useEffect(() => {
    try {
      const parsedUiSchema = JSON.parse(uiSchema);
      setSchema(recursiveRender(parsedUiSchema));
      setFormData(parsedUiSchema.formData);
    } catch (error) {
      console.error('Error parsing UI schema:', error);
    }
  }, [uiSchema]);

  const handleSubmit = ({ formData }) => {
    console.log('Form Data Submitted:', formData);
    // Implement logic to send formData to the backend
  };

  return (
    <div style={{ width: '50%', padding: '20px' }}>
      <h2>Form Renderer</h2>
      <Form schema={schema} formData={formData} onSubmit={handleSubmit} />
    </div>
  );
};

export default FormGenerator;
