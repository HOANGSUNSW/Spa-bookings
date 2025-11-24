import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import type { Review, Service, User, Promotion, Appointment } from '../../types';
import { StarIcon, HeartIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '../../shared/icons';
import * as apiService from '../services/apiService';

interface ServiceDetailPageProps {
    allServices: Service[];
    currentUser: User | null;
    allPromotions: Promotion[];
    setAllReviews: React.Dispatch<React.SetStateAction<Review[]>>;
    setAllAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ allServices, currentUser, allPromotions, setAllReviews, setAllAppointments }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [service, setService] = useState<Service | null>(null);
    const [serviceReviews, setServiceReviews] = useState<Review[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);

    // New states for review form
    const [userCanReview, setUserCanReview] = useState(false);
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Service ID is missing.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const fetchedService = await apiService.getServiceById(id);
                setService(fetchedService);

                const fetchedReviews = await apiService.getReviews({ serviceId: id });
                setServiceReviews(fetchedReviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                
                const fetchedUsers = await apiService.getUsers();
                setAllUsers(fetchedUsers);

            } catch (err: any) {
                console.error("Failed to fetch service detail data:", err);
                setService(null);
                setServiceReviews([]);
                setError(err.message || "Không thể tải chi tiết dịch vụ.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const checkReviewEligibility = async () => {
            if (currentUser && service) {
                try {
                    const userAppointments = await apiService.getUserAppointments(currentUser.id);
                    const completedAppointmentsForThisService = userAppointments.filter(
                        app => app.serviceId === service.id && app.status === 'completed'
                    );

                    if (completedAppointmentsForThisService.length > 0) {
                        const userReviewsForThisService = serviceReviews.filter(
                            review => review.userId === currentUser.id && review.serviceId === service.id
                        );
                        
                        if (completedAppointmentsForThisService.length > userReviewsForThisService.length) {
                            setUserCanReview(true);
                            setReviewMessage('');
                        } else {
                            setUserCanReview(false);
                            setReviewMessage('Bạn đã đánh giá tất cả các lần sử dụng dịch vụ này.');
                        }
                    } else {
                        setUserCanReview(false);
                        setReviewMessage('Bạn cần hoàn thành dịch vụ này để có thể đánh giá.');
                    }
                } catch (error) {
                    console.error("Failed to check review eligibility:", error);
                    setUserCanReview(false);
                }
            } else {
                setUserCanReview(false);
            }
        };

        if (service) {
            checkReviewEligibility();
        }

    }, [currentUser, service, serviceReviews]);

    const expiringSoonPromo = useMemo(() => {
        if (!service || !allPromotions) return null;

        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const applicablePromos = allPromotions.filter(promo => {
            const appliesToService = !promo.applicableServiceIds || promo.applicableServiceIds.length === 0 || promo.applicableServiceIds.includes(service.id);
            if (!appliesToService) return false;

            const expiryDate = new Date(promo.expiryDate);
            return expiryDate > now && expiryDate <= sevenDaysFromNow;
        });
        
        return applicablePromos.length > 0 ? applicablePromos[0] : null;
    }, [service, allPromotions]);


    
    const relatedServices = useMemo(() => {
        if (!service || allServices.length === 0) return [];
        return allServices.filter(
            s => s.categoryId === service.categoryId && s.id !== service.id && s.isActive
        ).slice(0, 3);
    }, [service, allServices]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const toggleFavorite = async () => {
        // TODO: Implement favorite service functionality
        // This would require a favorites table in the database
        setIsFavorite(!isFavorite);
        console.log(`Service ${service?.id} ${isFavorite ? 'removed from' : 'added to'} favorites for user ${currentUser?.id}`);
    }

    const handleConsultationClick = () => {
        window.dispatchEvent(new CustomEvent('open-chatbot'));
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0 || !currentUser || !service) {
            alert('Vui lòng chọn số sao đánh giá.');
            return;
        }
        setIsSubmittingReview(true);
        try {
            const userAppointments = await apiService.getUserAppointments(currentUser.id);
            const reviewedAppointmentIds = new Set(
                (await apiService.getReviews({ userId: currentUser.id }))
                .map(r => r.appointmentId)
                .filter(Boolean) as string[]
            );
            
            const appointmentToReview = userAppointments.find(
                app => app.serviceId === service.id &&
                       app.status === 'completed' &&
                       !reviewedAppointmentIds.has(app.id)
            );

            const reviewPayload: Partial<Review> = {
                userId: currentUser.id,
                serviceId: service.id,
                appointmentId: appointmentToReview?.id,
                userName: currentUser.name,
                userImageUrl: currentUser.profilePictureUrl,
                rating: newRating,
                comment: newComment,
                serviceName: service.name,
            };

            const createdReview = await apiService.createReview(reviewPayload);

            // Update local and global state
            setServiceReviews(prev => [createdReview, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setAllReviews(prev => [createdReview, ...prev]);

            if (appointmentToReview) {
                setAllAppointments(prev => prev.map(app => 
                    app.id === appointmentToReview.id ? { ...app, reviewRating: createdReview.rating } : app
                ));
            }

            setIsReviewFormVisible(false);
            setNewRating(0);
            setNewComment('');
            
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmittingReview(false);
        }
    };


    if (isLoading) {
        return <div className="text-center py-32 text-gray-500 text-lg animate-pulse">Đang tải chi tiết dịch vụ...</div>;
    }

    if (error) {
        return <div className="text-center py-32 text-red-500 text-lg">Lỗi: {error}</div>;
    }

    if (!service) {
        return <div className="text-center py-32 text-gray-500 text-lg">Dịch vụ không tồn tại.</div>;
    }

    const reviewForm = (
        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-soft-lg border border-gray-100 animate-fadeInUp">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Viết đánh giá của bạn</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700">Chất lượng dịch vụ:</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${star <= (hoverRating || newRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận chi tiết của bạn về không gian, kỹ thuật viên và hiệu quả dịch vụ..."
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all resize-none bg-gray-50"
                    required
                ></textarea>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmittingReview || newRating === 0}
                        className="bg-brand-dark text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-primary transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                    </button>
                </div>
            </form>
        </div>
    );
    
    const reviewCtaSection = (
        <div className="mt-12 text-center bg-brand-secondary/30 p-8 rounded-[2rem] border border-brand-primary/10">
            {currentUser ? (
                userCanReview ? (
                    <>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Chia sẻ trải nghiệm của bạn</h3>
                        <p className="text-gray-600 mb-6 max-w-xl mx-auto">Bạn đã sử dụng dịch vụ này. Hãy để lại đánh giá để giúp chúng tôi hoàn thiện hơn và giúp khách hàng khác có lựa chọn tốt nhất!</p>
                        <button 
                            onClick={() => setIsReviewFormVisible(true)}
                            className="bg-brand-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-dark transition-all shadow-md hover:-translate-y-0.5"
                        >
                            Viết đánh giá ngay
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500 italic font-medium">{reviewMessage}</p>
                )
            ) : (
                <p className="text-gray-600">
                    Vui lòng <Link to="/login" className="font-bold text-brand-primary hover:underline">đăng nhập</Link> để viết đánh giá.
                </p>
            )}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 1. Back Button & Breadcrumb */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-gray-500 font-semibold hover:text-brand-dark transition-colors"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm mr-3 group-hover:bg-brand-secondary transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    Quay lại danh sách
                </button>
            </div>

            {/* 2. Hero Service Detail */}
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-[2.5rem] shadow-soft-xl overflow-hidden border border-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left: Image */}
                        <div className="relative h-[400px] lg:h-auto overflow-hidden group">
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                            <img 
                                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s]" 
                                src={service.imageUrl.replace('/400/300', '/800/600')} 
                                alt={service.name} 
                            />
                             {/* Badges */}
                             <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                                {service.discountPrice && (
                                    <span className="bg-brand-accent text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md backdrop-blur-md">
                                        -{Math.round(((service.price - service.discountPrice) / service.price) * 100)}%
                                    </span>
                                )}
                                {service.isHot && <span className="bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">HOT</span>}
                            </div>
                        </div>
                        
                        {/* Right: Info */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                             {/* Category Tag */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-brand-secondary/50 text-brand-primary text-xs font-bold uppercase tracking-wider rounded-md border border-brand-primary/20">
                                    {service.categoryId}
                                </span>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-brand-dark leading-tight">{service.name}</h1>
                                <button onClick={toggleFavorite} className={`p-3 rounded-full transition-all hover:scale-110 shadow-sm border ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-400'}`}>
                                    <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(service.rating) ? 'fill-current' : 'text-gray-200'}`}/>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-medium border-l border-gray-300 pl-3">{service.reviewCount} đánh giá</span>
                            </div>

                            {/* Description */}
                            <div className="prose prose-gray text-gray-600 mb-8 leading-relaxed">
                                {service.description || service.description}
                            </div>

                            {/* Promo Alert */}
                            {expiringSoonPromo && (
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 flex items-start gap-3 animate-pulse-slow">
                                    <div className="p-2 bg-white rounded-full shadow-sm text-amber-500"><ClockIcon className="w-5 h-5" /></div>
                                    <div>
                                        <p className="font-bold text-amber-800 text-sm">Ưu đãi sắp hết hạn!</p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            Nhập mã <strong className="font-mono bg-white px-1 rounded border border-amber-200">{expiringSoonPromo.code}</strong> để nhận ưu đãi. Hạn: {new Date(expiringSoonPromo.expiryDate).toLocaleDateString('vi-VN')}.
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Price & Duration */}
                            <div className="flex items-end gap-6 mb-8 pb-8 border-b border-dashed border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Giá dịch vụ</p>
                                    <div className="flex items-baseline gap-3">
                                        {service.discountPrice ? (
                                            <>
                                                <span className="text-3xl font-extrabold text-brand-accent">{formatPrice(service.discountPrice)}</span>
                                                <span className="text-lg text-gray-400 line-through font-medium">{formatPrice(service.price)}</span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-brand-dark">{formatPrice(service.price)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Thời lượng</p>
                                    <span className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                        <ClockIcon className="w-5 h-5 text-gray-400"/> {service.duration} phút
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-brand-dark mb-4">Mô tả chi tiết:</h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {service.description || 'Chưa có mô tả chi tiết cho dịch vụ này.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Reviews Section */}
            <div className="container mx-auto px-4 mt-16 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-serif font-bold text-brand-dark">Đánh giá khách hàng</h2>
                     <div className="hidden md:flex items-center gap-2">
                         <span className="text-4xl font-bold text-brand-text">{service.rating}</span>
                         <div className="flex flex-col text-xs text-gray-500">
                             <div className="flex text-yellow-400 text-sm">★★★★★</div>
                             <span>{service.reviewCount} lượt đánh giá</span>
                         </div>
                     </div>
                </div>
               
                {serviceReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {serviceReviews.map((review: Review) => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={review.userImageUrl} alt={review.userName} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{review.userName}</h4>
                                            <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs bg-yellow-50 px-2 py-1 rounded-md">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}/>)}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-400">Chưa có đánh giá nào cho dịch vụ này.</p>
                    </div>
                )}
                
                {isReviewFormVisible ? reviewForm : reviewCtaSection}
            </div>

            {/* 4. Related Services */}
            {relatedServices.length > 0 && (
                <div className="container mx-auto px-4 mt-24 max-w-6xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-serif font-bold text-brand-dark">Có thể bạn sẽ thích</h2>
                        <Link to="/services" className="text-brand-primary font-bold hover:underline">Xem tất cả</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedServices.map(relatedService => (
                            <ServiceCard key={relatedService.id} service={relatedService} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailPage;