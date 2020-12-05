import React from "react";

function NewInstrumentForm(props) {
  const { instrumentid, name, properties } = props.instrument;
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
    props.add({ instrumentid, name, properties: propertiesChecked });
  };
  return (
    <div>
      <h3> Instrument Information </h3>
      <p>Instrument ID: {instrumentid}</p>
      <p>Instrument Name: {name} </p>
      <p> Properties: </p>
      <form onSubmit={(event) => onAddClickHandler(event)}>
        {properties.map((el, index) => (
          <label key={`${el._id}${index}`}>
            <input
              type="checkbox"
              name="SelectedProperties"
              value={el.property}
            />
            {el.property}
          </label>
        ))}
        <p />
        <input type="submit" value="Add" />
      </form>
    </div>
  );
}

export default NewInstrumentForm;
