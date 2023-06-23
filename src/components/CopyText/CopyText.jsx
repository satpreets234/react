import React from 'react';
import { toast } from 'react-toastify';

function CopyButton(props) {
//   const textToCopy = 'Text to be copied'; // Replace with the text you want to copy
  const handleCopy = () => {
    navigator.clipboard.writeText(props.textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');
        toast.success('Text copied to clipboard !')
        // You can show a success message or perform any other action here
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
        // You can show an error message or perform any other action here
      });
  };

  return (
    <button onClick={handleCopy}>Copy Text</button>
  );
}

export default CopyButton;