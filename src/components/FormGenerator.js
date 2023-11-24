// // import React, { useState, useEffect } from 'react';
// import Form from 'react-jsonschema-form';

// const FormGenerator = ({ uiSchema }) => {
//   const [formData, setFormData] = useState({});
//   const [schema, setSchema] = useState({});
//   const [ui, setUi] = useState({});

//   useEffect(() => {
//     try {
//       const parsedUiSchema = JSON.parse(uiSchema);
//       setUi(parsedUiSchema);
//       // Assuming you have schema and formData in your UI schema
//       setSchema(parsedUiSchema.schema);
//       setFormData(parsedUiSchema.formData);
//     } catch (error) {
//       console.error('Error parsing UI schema:', error);
//       // Handle the error as needed
//     }
//   }, [uiSchema]);

//   const handleSubmit = ({ formData }) => {
//     console.log('Form Data Submitted:', formData);
//     // Implement logic to send formData to the backend
//   };

//   return (
//     <div style={{ width: '50%', padding: '20px' }}>
//       <h2>Form Renderer</h2>
//       <Form
//         schema={schema}
//         uiSchema={ui}
//         formData={formData}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// };

// export default FormGenerator;


// import React, { useState, useEffect } from 'react';
// import Form from 'react-jsonschema-form';

// const FormGenerator = ({ uiSchema }) => {
//   const [formData, setFormData] = useState({});
//   const [schema, setSchema] = useState({});
//   const [ui, setUi] = useState({});

//   useEffect(() => {
//     try {
//       const parsedUiSchema = JSON.parse(uiSchema);
//       setUi(parsedUiSchema);
//       // Assuming you have schema and formData in your UI schema
//       setSchema(parsedUiSchema.schema);
//       setFormData(parsedUiSchema.formData);
//     } catch (error) {
//       console.error('Error parsing UI schema:', error);
//       // Handle the error as needed
//     }
//   }, [uiSchema]);

//   const handleSubmit = ({ formData }) => {
//     console.log('Form Data Submitted:', formData);
//     // Implement logic to send formData to the backend
//   };

//   return (
//     <div style={{ width: '50%', padding: '20px' }}>
//       <h2>Form Renderer</h2>
//       <Form
//         schema={schema}
//         uiSchema={ui}
//         formData={formData}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// };

// export default FormGenerator;


// src/components/FormGenerator.js
import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';

// src/components/FormGenerator.js
// ... (other imports and code)

const recursiveRender = (fields) => {
  return {
    type: 'object',
    properties: fields.reduce((acc, field) => {
      if (field.uiType === 'Group') {
        const groupFields = field.subParameters ? recursiveRender(field.subParameters) : {};
        acc[field.jsonKey] = {
          type: 'object',
          properties: groupFields.properties,
        };
      } else {
        acc[field.jsonKey] = { type: 'string', title: field.label };
        if (field.uiType.toLowerCase() === 'select') {
          acc[field.jsonKey].enum = field.validate.options.map(option => option.value);
          acc[field.jsonKey].enumNames = field.validate.options.map(option => option.label);
        }
      }
      return acc;
    }, {}),
  };
};

// ... (rest of the component code)


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
