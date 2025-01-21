import { useNavigate } from "react-router-dom";

export default function ForbiddenError(){
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-600">403</h1>
        <p className="text-xl text-gray-600 mt-4">ไม่มีสิทธิ์เข้าถึง</p>
        <p className="text-gray-500 mt-2">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
};