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
      // Check if the field is a Switch
      acc[field.jsonKey] = {
        type: 'boolean',
        title: field.label,
      };
    } else if (field.uiType === 'Input' || field.uiType === 'Select') {
      // Input and Select fields
      if (field.jsonKey === 'second_topping' && !showAdvancedFields) {
        // Skip the "Second Topping" field if advanced fields are not shown
        return;
      }

      acc[field.jsonKey] = { type: 'string', title: field.label };
    }
  });

  return {
    type: 'object',
    properties: acc,
  };
};

const FormRenderer = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [uiSchemaParsed, setUiSchemaParsed] = useState(false);

  useEffect(() => {
    try {
      const parsedUiSchema = JSON.parse(uiSchema);
      setSchema(recursiveRender(parsedUiSchema, null, showAdvancedFields));
      // Initialize formData with default values from parsedUiSchema
      setFormData(parsedUiSchema.formData || {});
      setUiSchemaParsed(true);
    } catch (error) {
      console.error('Error parsing UI schema:', error);
    }
  }, [uiSchema, showAdvancedFields]);

  const handleSubmit = ({ formData }) => {
    console.log('Form Data Submitted:', formData);
    // Implement logic to send formData to the backend
  };

  return (
    <div>
      <h2>Form Renderer</h2>
      {uiSchemaParsed && (
        <div>
          <Form
            schema={schema}
            formData={formData}
            onSubmit={handleSubmit}
            fields={{
              // Define a custom field template to include "Show Advanced Fields" within the form
              'showAdvancedFields': (props) => (
                <div style={{ marginTop: '10px' }}>
                  <label>
                    {showAdvancedFields ? 'Hide' : 'Show'} Advanced Fields
                    <input
                      type="checkbox"
                      checked={showAdvancedFields}
                      onChange={() => setShowAdvancedFields(!showAdvancedFields)}
                    />
                  </label>
                </div>
              ),
            }}
          />
        </div>
      )}
      {/* Include other elements within the same div if needed */}
    </div>
  );
};

export default FormRenderer;