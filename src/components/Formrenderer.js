import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';

const recursiveRender = (fields, currentTab = null, showAdvancedFields = false) => {
  let acc = {};

  fields.forEach((field) => {
    if (field.uiType === 'Group') {
      const groupFields = field.subParameters
        ? recursiveRender(field.subParameters, currentTab, showAdvancedFields)
        : {};
      acc[field.jsonKey] = {
        type: 'object',
        properties: groupFields.properties,
      };
    } else if (field.uiType === 'Radio') {
      acc[field.jsonKey] = {
        type: 'string',
        title: field.label,
        enum: field.validate.options.map((option) => option.value),
        enumNames: field.validate.options.map((option) => option.label),
        uiType: 'Radio',
        radioType: field.uiType,
      };
    } else if (field.uiType === 'Switch') {
      acc[field.jsonKey] = {
        type: 'boolean',
        title: field.label,
      };
    } else if (field.uiType === 'Input') {
      acc[field.jsonKey] = { type: 'string', title: field.label };
    } else if (field.uiType === 'Select') {
      // Check if the field is "Sauce" or "Main_topping" and add options accordingly
      if (field.jsonKey === 'sauce' || field.jsonKey === 'main_topping') {
        acc[field.jsonKey] = {
          type: 'string',
          title: field.label,
          enum: field.validate.options.map((option) => option.value),
          enumNames: field.validate.options.map((option) => option.label),
        };
      } else if (field.jsonKey === 'second_topping' && showAdvancedFields) {
        // Check if the field is "Second_topping" and "Show Advanced Fields" is true
        acc[field.jsonKey] = {
          type: 'string',
          title: field.label,
          enum: field.validate.options.map((option) => option.value),
          enumNames: field.validate.options.map((option) => option.label),
        };
      }
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
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  useEffect(() => {
    try {
      const parsedUiSchema = JSON.parse(uiSchema);
      setSchema(recursiveRender(parsedUiSchema, null, showAdvancedFields));
      setFormData(parsedUiSchema.formData);
    } catch (error) {
      console.error('Error parsing UI schema:', error);
    }
  }, [uiSchema, showAdvancedFields]);

  const handleSubmit = ({ formData }) => {
    console.log('Form Data Submitted:', formData);
    // Implement logic to send formData to the backend
  };

  return (
    <div style={{ width: '50%', padding: '20px' }}>
      <h2>Form Renderer</h2>
      <div>
        <label>
          Show Advanced Fields
          <input
            type="checkbox"
            checked={showAdvancedFields}
            onChange={() => setShowAdvancedFields(!showAdvancedFields)}
          />
        </label>
      </div>
      <Form schema={schema} formData={formData} onSubmit={handleSubmit} />
    </div>
  );
};

export default FormGenerator;