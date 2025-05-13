import React from 'react';

function PasswordModal({ visible, meeting, input, error, onCancel, onChange, onSubmit }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-sm bg-black/40  flex items-center justify-center z-50">
      <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-lg text-white w-80">
        <h2 className="text-lg font-semibold mb-4">Enter Meeting Password</h2>
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          placeholder="Enter password"
          value={input}
          onChange={onChange}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
