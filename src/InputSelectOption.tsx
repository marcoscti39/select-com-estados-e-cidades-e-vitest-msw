import React, { Attributes, HTMLAttributes } from "react";

type InputSelectOptionProps = HTMLAttributes<HTMLDivElement> & {
  stateAbb: string;
  children: string;
};

const InputSelectOption: React.FC<InputSelectOptionProps> = ({
  stateAbb,
  children,
  ...rest
}) => {
  return (
    <div data-state-abb={stateAbb} className="input-select-option" {...rest}>
      {children}
    </div>
  );
};

export default InputSelectOption;
