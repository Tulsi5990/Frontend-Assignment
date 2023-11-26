import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';
import './FormGenerator.css'; // Import a separate CSS file for styling

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
      if (field.jsonKey === 'second_topping' && !showAdvancedFields) {
        // Skip rendering "second_topping" when showAdvancedFields is false
        return;
      }
      acc[field.jsonKey] = {
        type: 'string',
        title: field.label,
        enum: field.validate.options.map((option) => option.value),
        enumNames: field.validate.options.map((option) => option.label),
      };
    }
  });

  return {
    type: 'object',
    properties: acc,
  };
};

// ... (import statements)

// ... (import statements)

const defaultSchema = {
  type: 'object',
  properties: {},
};

const FormGenerator = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState(defaultSchema); // Use defaultSchema initially
  const [showAdvancedFields, setShowAdvancedFields] = useState(true);

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

  const showToggle = Object.keys(schema.properties || {}).length > 0;

  return (
    <div className="form-container">
      <h2>FORM GENERATED</h2>
      <Form schema={schema} formData={formData} onSubmit={handleSubmit}>
        {/* Always render the toggle */}
        {showToggle && (
          <div className="toggle-container">
            <label className="toggle-label">Show Advanced Fields</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                className="toggle-input"
                checked={showAdvancedFields}
                onChange={() => setShowAdvancedFields(!showAdvancedFields)}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        )}
        {/* Render a default submit button even if the schema is empty */}
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default FormGenerator;
