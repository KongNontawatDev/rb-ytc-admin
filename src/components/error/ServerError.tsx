
export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">500</h1>
        <p className="text-xl text-gray-600 mt-4">เกิดข้อผิดพลาดที่เซิร์ฟเวอร์</p>
        <p className="text-gray-500 mt-2">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          โหลดหน้าใหม่
        </button>
      </div>
    </div>
  );
};