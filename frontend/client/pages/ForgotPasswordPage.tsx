
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const ForgotPasswordPage: React.FC = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage(`Nếu email "${email}" tồn tại trong hệ thống, chúng tôi đã gửi một liên kết đặt lại mật khẩu đến đó.`);
//     };

//     return (
//         <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
//             <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
//                 <h1 className="text-3xl font-serif font-bold text-brand-dark text-center mb-6">Quên Mật Khẩu</h1>
                
//                 {message ? (
//                     <div className="text-center">
//                         <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm mb-4">{message}</p>
//                         <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
//                             Quay lại trang Đăng nhập
//                         </Link>
//                     </div>
//                 ) : (
//                     <>
//                         <p className="text-center text-sm text-gray-600 mb-6">
//                             Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
//                         </p>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div>
//                                 <label htmlFor="email-forgot" className="block text-sm font-medium text-brand-text">Địa chỉ Email</label>
//                                 <input
//                                     id="email-forgot"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     placeholder="Vui lòng nhập địa chỉ email của bạn"
//                                     className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
//                                 />
//                             </div>
//                             <div>
//                                 <button
//                                     type="submit"
//                                     className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-md hover:bg-brand-primary transition-colors duration-300 shadow-lg"
//                                 >
//                                     Gửi Liên Kết Đặt Lại
//                                 </button>
//                             </div>
//                         </form>
//                         <p className="mt-6 text-center text-sm text-gray-600">
//                             Nhớ mật khẩu của bạn?{' '}
//                             <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
//                                 Đăng nhập
//                             </Link>
//                         </p>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ForgotPasswordPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as apiService from '../services/apiService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            console.log('🔄 Sending forgot password request for email:', email);
            const result = await apiService.forgotPassword(email);
            console.log('✅ Forgot password response:', result);
            setMessage(result.message);
        } catch (err: any) {
            console.error('❌ Forgot password error:', err);
            // Check if it's a 404 error (route not found)
            if (err.message && err.message.includes('Not Found')) {
                setError('Không tìm thấy API endpoint. Vui lòng kiểm tra lại backend server.');
            } else {
                setError(err.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-light px-4">
            {/* Dynamic Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-white to-rose-50 animate-gradient-slow z-0 opacity-90"></div>

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-glass z-10 border border-white/60 animate-fadeInUp relative">
                
                {/* Back Button */}
                <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-brand-primary transition-colors p-2 hover:bg-white rounded-full group" title="Quay lại">
                    <ArrowUturnLeftIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform"/>
                </Link>

                <div className="text-center mb-8 mt-2">
                    <div className="inline-block mb-4 p-3 bg-brand-secondary/30 rounded-full">
                        <LogoIcon className="h-12 w-12 text-brand-primary drop-shadow-sm" />
                    </div>
                    <h1 className="text-3xl font-serif font-extrabold text-brand-dark mb-2 tracking-tight">Quên Mật Khẩu?</h1>
                    <p className="text-sm text-gray-500 font-medium">Đừng lo, chúng tôi sẽ giúp bạn lấy lại quyền truy cập.</p>
                </div>
                
                {message ? (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm mb-4">{message}</p>
                        <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
                            Quay lại trang Đăng nhập
                        </Link>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label htmlFor="email-forgot" className="block text-xs font-bold text-gray-500 mb-1.5 pl-1 uppercase tracking-wide">Địa chỉ Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        id="email-forgot"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com"
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-gray-50/50 text-brand-text rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all duration-200 text-sm font-medium placeholder-gray-400 shadow-sm"
                                    />
                                </div>
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-md hover:bg-brand-primary transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Đang gửi...' : 'Gửi Liên Kết Đặt Lại'}
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 text-center pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-600 font-medium">
                                Nhớ mật khẩu của bạn?{' '}
                                <Link to="/login" className="font-bold text-brand-primary hover:text-brand-accent transition-colors hover:underline decoration-2 underline-offset-4">
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;