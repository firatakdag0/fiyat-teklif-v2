"use client";
export default function Error() {
  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="form-header">
          <img src="/logo.png" alt="EasyTrade Logo" className="header-logo" />
          <span className="header-title">EasyTrade</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">Bir hata oluştu</h2>
        <p className="subtitle text-center mb-6">Kayıt olurken bir hata meydana geldi. Lütfen tekrar deneyin.</p>
        <button
          onClick={() => window.location.reload()}
          className="submit-button w-full mt-2"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
} 