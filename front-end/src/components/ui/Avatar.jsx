import React from 'react';
import PropTypes from 'prop-types';
//import '../../styles/sharedStyles.css';

/**
 * Avatar component for user profile pictures
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.size - Size of avatar: 'sm', 'md', or 'lg'
 * @param {string} props.className - Additional CSS classes
 */
const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  // Default placeholder image if src is not provided
  const defaultImage = "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
  
  // Determine size class based on props
  const sizeClass = size === 'sm' 
    ? 'avatar-sm' 
    : size === 'lg' 
      ? 'avatar-lg' 
      : 'avatar-md';
  
  return (
    <img
      src={src || defaultImage}
      alt={alt || "User avatar"}
      className={`avatar ${sizeClass} ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultImage;
      }}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Avatar;