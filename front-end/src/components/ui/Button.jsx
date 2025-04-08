import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/sharedStyles.css';

/**
 * Reusable Button component
 * 
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary', 'outline', or 'danger'
 * @param {string} props.type - Button type attribute
 * @param {boolean} props.disabled - Disabled state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({ 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  onClick, 
  className = '', 
  children 
}) => {
  // Determine variant class based on props
  const variantClass = variant === 'outline' 
    ? 'btn-outline' 
    : variant === 'danger' 
      ? 'btn-danger' 
      : 'btn-primary';
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'outline', 'danger']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;