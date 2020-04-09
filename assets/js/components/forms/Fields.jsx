import React from 'react';

const Field = ({ name, label, value, onChange, placeholder , type= "text", error = "", min, max}) =>
 (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type={type} className={"form-control" + (error && " is-invalid")}  placeholder={placeholder} min={min} max={max} name={name} id={name}
               value={value} onChange={onChange}/>
        { error && <p className={"invalid-feedback"}>{error}</p>}
    </div>
);

export default Field;