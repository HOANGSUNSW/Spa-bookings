import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Promotion } from '../../types';
import { ClockIcon, SparklesIcon, CheckCircleIcon, GiftIcon } from '../../shared/icons';

interface PromotionCardProps {
  promotion: Promotion;
}

const useCountdown = (targetDate: string) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearTimeout(timer);
    });
    return timeLeft;
};

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const timeLeft = useCountdown(promotion.expiryDate);
  const isExpired = timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0;
  const [isCopied, setIsCopied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const discountDisplay = promotion.discountType === 'percentage' 
    ? `${promotion.discountValue}%` 
    : formatPrice(promotion.discountValue);

  const bookingLink = `/booking?promoCode=${promotion.code}${
    promotion.applicableServiceIds && promotion.applicableServiceIds.length > 0
      ? `&serviceId=${promotion.applicableServiceIds[0]}`
      : ''
  }`;

  const handleCopyCode = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(promotion.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`group relative bg-white rounded-[2rem] shadow-card hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden h-full flex flex-col ${isExpired ? 'grayscale opacity-70' : ''}`}>
      
      {/* Decorative Glow Behind */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-brand-accent to-orange-400 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

      {/* Image Section */}
      <div className="relative h-52 overflow-hidden rounded-t-[2rem]">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
        <img 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
            src={promotion.imageUrl} 
            alt={promotion.title} 
            loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Discount Badge - Floating 3D effect */}
        <div className="absolute top-4 right-4 z-20 transform group-hover:scale-110 transition-transform duration-300">
             <div className="bg-coral-gradient text-white px-4 py-2 rounded-2xl shadow-lg shadow-rose-500/30 flex flex-col items-center justify-center min-w-[80px] border-2 border-white/20 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Giảm</span>
                <span className="text-xl font-extrabold leading-none">{discountDisplay}</span>
            </div>
        </div>

        {/* Audience Tag */}
        <div className="absolute top-4 left-4 z-20">
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                 {promotion.targetAudience === 'All' ? 'Tất cả khách hàng' : promotion.targetAudience}
             </span>
        </div>

        {/* Title over Image */}
        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
            <h3 className="text-xl font-serif font-bold text-white leading-tight drop-shadow-md line-clamp-2 group-hover:text-cyan-50 transition-colors">
                {promotion.title}
            </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow relative bg-white">
        <div className="flex-grow">
             <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4 leading-relaxed">{promotion.description}</p>
             
             {/* Timer */}
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-2 rounded-lg w-fit mb-4 border border-gray-100">
                <ClockIcon className={`w-4 h-4 ${isExpired ? 'text-red-500' : 'text-brand-primary'}`} />
                {isExpired ? (
                    <span className="text-red-500">Đã hết hạn</span>
                ) : (
                    <span>Hết hạn sau: <span className="text-brand-dark">{timeLeft.days} ngày {timeLeft.hours}h</span></span>
                )}
            </div>
        </div>

        {/* Ticket Separator */}
        <div className="relative flex items-center justify-center w-full my-2">
            <div className="w-full border-t-2 border-dashed border-gray-200"></div>
            <div className="absolute -left-8 w-6 h-6 bg-brand-light rounded-full"></div> {/* Cutout Left - matches page bg */}
            <div className="absolute -right-8 w-6 h-6 bg-brand-light rounded-full"></div> {/* Cutout Right - matches page bg */}
        </div>

        {/* Action Area */}
        <div className="pt-2 space-y-3">
            {/* Code Box */}
            <div 
                onClick={!isExpired ? handleCopyCode : undefined}
                className={`relative flex items-center justify-between p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all group/code ${
                    isCopied 
                        ? 'bg-green-50 border-green-400' 
                        : isExpired 
                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                            : 'bg-brand-secondary/30 border-brand-primary/30 hover:border-brand-primary hover:bg-brand-secondary'
                }`}
            >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Mã ưu đãi</span>
                    <span className={`font-mono text-lg font-extrabold ${isCopied ? 'text-green-600' : 'text-brand-dark'}`}>
                        {promotion.code}
                    </span>
                </div>
                <div className="text-brand-primary">
                    {isCopied ? (
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                            <CheckCircleIcon className="w-5 h-5" /> Đã chép
                        </div>
                    ) : (
                         <GiftIcon className={`w-6 h-6 ${isExpired ? 'text-gray-400' : 'text-brand-primary group-hover/code:scale-110 transition-transform'}`} />
                    )}
                </div>
                {!isExpired && !isCopied && (
                    <span className="absolute top-[-10px] right-2 bg-white text-[10px] font-bold text-brand-primary px-2 border border-brand-primary/20 rounded shadow-sm opacity-0 group-hover/code:opacity-100 transition-opacity">
                        Chạm để chép
                    </span>
                )}
            </div>

            {/* Use Button */}
            <Link 
                to={bookingLink} 
                className={`flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 transform active:scale-95 ${
                    isExpired 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-ocean-gradient text-white hover:shadow-cyan-500/40 hover:-translate-y-1'
                }`}
                onClick={(e) => isExpired && e.preventDefault()}
            >
                {isExpired ? 'Đã kết thúc' : (
                    <>
                        <SparklesIcon className="w-4 h-4 mr-2 animate-pulse" /> Dùng Ngay
                    </>
                )}
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;