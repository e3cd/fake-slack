import { useState } from "react";

export default initialVal => {
  const [value, setValue] = useState(initialVal);
  const handleChange = event => {
    setValue(event.target.value);
  };
  const reset = () => {
    setValue("");
  };

  //can return an object from a hook
  return [value, handleChange, reset];
};
