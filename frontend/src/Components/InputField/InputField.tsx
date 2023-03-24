import React from 'react';

interface Props {
  field: string;
  label?: string;
  value?: string | number;
  placeholder?: string;
  type: string;
}

export default function InputField({ field, label, value, type, placeholder }: Props) {
  return (
    <div>
      {label && (
        <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <input
        type={type}
        id={field}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
        placeholder={placeholder}
        required
        value={value}
      />
    </div>
  );
}
