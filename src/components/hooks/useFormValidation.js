import { useState, useEffect } from "react";

export default (initialState, validate, authenticateUser) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  //check to see if errors object has changed
  useEffect(() => {
    if (isSubmitting) {
      //check for errors
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        //no errors = register / log user in via firebase
        authenticateUser();
        setValues(initialState);
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = event => {
    //use persist event recieved from handlechange

    event.persist();
    setErrors("");
    setValues(previousValues => ({
      ...previousValues,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setErrors(null);
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
    console.log("submitted");
  };

  return {
    values,
    errors,
    isSubmitting,
    handleSubmit,
    handleChange
  };
};
