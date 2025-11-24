
// import React from 'react';
// import { Link } from 'react-router-dom';
// import type { Service } from '../../types';
// import { StarIcon } from '../../shared/icons';

// interface ServiceCardProps {
//   service: Service;
// }

// const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
//   };
  
//   const discountPercent = service.discountPrice 
//     ? Math.round(((service.price - service.discountPrice) / service.price) * 100)
//     : 0;

//   return (
//     <div 
//         className="bg-white rounded-lg shadow-soft-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 border border-gray-200/50"
//     >
//       <div className="relative overflow-hidden bg-gray-100">
//         <img 
//             className="w-full h-32 object-contain object-center transform group-hover:scale-110 transition-transform duration-500 ease-out" 
//             src={service.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
//             alt={service.name} 
//             loading="lazy"
//             style={{ 
//                 objectFit: 'contain',
//                 objectPosition: 'center',
//                 width: '100%',
//                 height: '100%'
//             }}
//         />
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//             {service.discountPrice && (
//                 <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                     ƯU ĐÃI -{discountPercent}%
//                 </span>
//             )}
//         </div>
//       </div>
//       <div className="p-3 flex flex-col flex-grow">
//         <h3 className="text-base font-bold font-serif text-brand-text mb-3 line-clamp-2 min-h-[48px]">
//             {service.name}
//         </h3>
        
//         <div className="mt-auto">
//              <div className="flex justify-between items-start mb-3 text-sm">
//                 {/* Left Column: Price and Rating */}
//                 <div className="flex flex-col gap-1">
//                     <span className="text-brand-text">
//                         <strong>Giá: </strong>
//                          {service.discountPrice ? (
//                             <span className="text-red-600 font-bold">{formatPrice(service.discountPrice)}</span>
//                           ) : (
//                             <span className="text-brand-primary font-bold">{formatPrice(service.price)}</span>
//                           )}
//                     </span>
//                     <div className="flex items-center gap-1 text-gray-500">
//                         <StarIcon className="w-5 h-5 text-yellow-400"/>
//                         <span>{service.rating} ({service.reviewCount})</span>
//                     </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="text-right">
//                     <span className="text-brand-text">
//                         <strong>Thời gian: </strong>{service.duration} phút
//                     </span>
//                     {service.discountPrice && (
//                         <span className="block text-gray-400 line-through text-xs mt-1">{formatPrice(service.price)}</span>
//                     )}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 <Link to={`/service/${service.id}`} className="text-center block bg-brand-secondary text-brand-text font-semibold py-1.5 px-3 rounded-lg hover:bg-brand-primary hover:text-white transition-colors duration-300 text-xs">
//                     Đọc thêm
//                 </Link>
//                 <Link to={`/booking?serviceId=${service.id}`} className="text-center block bg-brand-dark text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-brand-primary transition-colors duration-300 text-xs">
//                     Đặt ngay
//                 </Link>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceCard;

import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import { StarIcon, ClockIcon, ArrowRightIcon } from '../../shared/icons';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const discountPercent = service.discountPrice 
    ? Math.round(((service.price - service.discountPrice) / service.price) * 100)
    : 0;

  return (
    <div 
        className="relative bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(14,116,144,0.15)] overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-brand-primary/20 h-full"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        {/* Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        <img 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            src={service.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={service.name} 
            loading="lazy"
        />
        
        {/* Badges - Glassmorphism Style */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {service.discountPrice && (
                <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                    -{discountPercent}%
                </span>
            )}
            {('isHot' in service && (service as any).isHot) && (
                 <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                    HOT
                </span>
            )}
             {('isNew' in service && (service as any).isNew) && (
                 <span className="bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                    NEW
                </span>
            )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative">
        {/* Title */}
        <div className="mb-2 min-h-[3rem]">
             <Link to={`/service/${service.id}`} className="text-lg font-bold font-serif text-brand-text line-clamp-2 group-hover:text-brand-primary transition-colors leading-tight block">
                {service.name}
            </Link>
        </div>
        
        {/* Meta Info Pills */}
        <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100/50">
                <StarIcon className="w-3 h-3 text-yellow-500 fill-current"/>
                <span className="text-[10px] font-bold text-yellow-700">{service.rating}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <ClockIcon className="w-3 h-3 text-gray-400"/>
                <span className="text-[10px] font-medium text-gray-600">{service.duration}p</span>
            </div>
        </div>
       
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow font-medium leading-relaxed opacity-80">
            {service.description}
        </p>
        
        <div className="mt-auto pt-3 border-t border-dashed border-gray-200">
             {/* Price */}
             <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                     {service.discountPrice ? (
                        <>
                            <span className="text-[10px] text-gray-400 line-through font-medium mb-0.5">{formatPrice(service.price)}</span>
                            <span className="text-lg font-extrabold text-brand-accent tracking-tight">{formatPrice(service.discountPrice)}</span>
                        </>
                      ) : (
                        <span className="text-lg font-extrabold text-brand-dark tracking-tight">{formatPrice(service.price)}</span>
                      )}
                </div>
            </div>

            {/* Buttons - Premium Look */}
            <div className="grid grid-cols-2 gap-2">
                <Link 
                    to={`/service/${service.id}`} 
                    className="flex items-center justify-center text-brand-text font-bold py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-xs border border-gray-200 group/btn"
                >
                    Chi tiết
                </Link>
                <Link 
                    to={`/booking?serviceId=${service.id}`} 
                    className="flex items-center justify-center gap-1 bg-ocean-gradient text-white font-bold py-2 px-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 text-xs transform active:scale-95"
                >
                    Đặt ngay <ArrowRightIcon className="w-3 h-3" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;