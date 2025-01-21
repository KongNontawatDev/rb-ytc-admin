import React, { useState } from "react";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";

export const Test: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<(string)>("");

  return (
    <>
      <h1>Multi-Select Dropdown Example</h1>
      <MultiSelectDropdown 
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        loading={false}
        options={[{label:"test 1",value:"test 1"}]}
      />
    </>
  );
};

export default Test;