import React from "react";

function NewInstrumentForm(props) {
  const { id, name, properties } = props.instrument;
  const onAddClickHandler = (event) => {
    event.preventDefault();
    const {
      target: { SelectedProperties },
    } = event;

    const propertiesChecked = Array.from(SelectedProperties)
      .filter((el) => el.checked)
      .map((el) => {
        return {
          name: el.value,
        };
      });
    // console.log(propertiesChecked);
    props.add({ id, name, properties: propertiesChecked });
  };
  return (
    <div>
      <h3> Instrument Information </h3>
      <p>Instrument ID: {id}</p>
      <p>Instrument Name: {name} </p>
      <p> Properties: </p>
      <form onSubmit={(event) => onAddClickHandler(event)}>
        {Object.keys(properties).map((key, index) => (
          <label key={`${key}${index}`}>
            <input type="checkbox" name="SelectedProperties" value={key} />
            {key}
          </label>
        ))}
        <p />
        <input type="submit" value="Add" />
      </form>
    </div>
  );
}

export default NewInstrumentForm;
