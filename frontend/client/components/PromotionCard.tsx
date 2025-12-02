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
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 ease-out ${isExpired ? 'opacity-60 grayscale' : ''}`}>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md inline-block">
                ƯU ĐÃI -{discountDisplay}
            </span>
        </div>
        <h3 className="text-lg font-bold font-serif text-brand-dark mb-2 h-14 line-clamp-2">
            {promotion.title}
        </h3>
        <p className="text-brand-text text-sm mb-4 h-10 overflow-hidden line-clamp-2">{promotion.description}</p>
        
        <div className="mt-auto">
            <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-brand-text">
                    <strong>Giảm giá: </strong>
                    <span className="text-red-600 font-bold">{discountDisplay}</span>
                </span>
                 <span className="text-brand-text flex items-center gap-1">
                    <ClockIcon className="w-4 h-4 text-gray-500"/>
                    <strong>Hạn: </strong>
                    {isExpired ? 'Hết hạn' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
                </span>
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