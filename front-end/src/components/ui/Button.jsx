import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/button.css';

/**
 * Enhanced Button component with standardized styling
 * 
 * @param {Object} props
 * @param {string} props.variant - Button style: 'primary', 'outline', 'danger'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {string} props.type - Button type attribute
 * @param {boolean} props.disabled - Disabled state
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md',
  type = 'button', 
  disabled = false, 
  onClick, 
  fullWidth = false,
  className = '', 
  children 
}) => {
  // Determine variant class
  const variantClass = `btn-${variant}`;
  // Determine size class
  const sizeClass = `btn-${size}`;
  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'outline', 'danger', 'follow', 'unfollow']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;