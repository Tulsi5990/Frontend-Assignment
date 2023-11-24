// // src/App.js
// import React from 'react';
// import JsonEditor from './components/JsonEditor';
// import FormGenerator from './components/FormGenerator';

// function App() {
//   const [uiSchema, setUiSchema] = React.useState('');

//   const handleSchemaChange = (value) => {
//     setUiSchema(value);
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <JsonEditor onSchemaChange={handleSchemaChange} />
//       <FormGenerator uiSchema={uiSchema} />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import JsonEditor from './components/JsonEditor';
import FormGenerator from './components/FormGenerator';

function App() {
  const [uiSchema, setUiSchema] = React.useState('');

  const handleSchemaChange = (value) => {
    setUiSchema(value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <JsonEditor onSchemaChange={handleSchemaChange} />
      <FormGenerator uiSchema={uiSchema} />
    </div>
  );
}

export default App;
