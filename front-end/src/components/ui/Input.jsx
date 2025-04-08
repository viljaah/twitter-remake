import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/sharedStyles.css";

/**
 * Reusable Input component with optional icon
 * 
 * @param {Object} props
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {boolean} props.required - Required attribute
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS classes
 */
const Input = ({ 
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  required = false,
  icon,
  className = '',
  ...rest
}) => {
  return (
    <div className="input-container">
      {icon && React.cloneElement(icon, { className: 'input-icon' })}
      <input
        type={type}
        className={`input ${className}`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...rest}
      />
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  icon: PropTypes.element,
  className: PropTypes.string
};

export default Input;