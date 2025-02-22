type Props = {
  error:any
}
export default function ClientError({error}:Props){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-600">Oops!</h1>
        <p className="text-xl text-gray-600 mt-4">เกิดข้อผิดพลาดที่ไม่คาดคิด</p>
        <p className="text-gray-500 mt-2">
          {error?.message || 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          โหลดหน้าใหม่
        </button>
      </div>
    </div>
  );
};