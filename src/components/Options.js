import React from "react";

const Options = ({ docs, handleOptionsChange }) => {
  return (
    <>
      <h2>Docs</h2>
      <select onChange={handleOptionsChange}>
        <option value="none" key="0">
          Choose a document
        </option>
        {docs.length &&
          docs.map((doc) => (
            <option value={doc._id} key={doc._id}>
              {doc.name}
            </option>
          ))}
      </select>
    </>
  );
};

export default Options;
