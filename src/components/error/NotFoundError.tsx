import { useNavigate } from "react-router-dom";

export default function NotFoundError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">ไม่พบหน้าที่คุณต้องการ</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
};