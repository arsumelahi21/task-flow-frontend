export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        {children}
      </div>
    </div>
  );
}
