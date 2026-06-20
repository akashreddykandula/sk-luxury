import React from 'react';
import {motion} from 'framer-motion';
import {
  FiCheck,
  FiPackage,
  FiTruck,
  FiHome,
  FiClipboard,
  FiXCircle,
} from 'react-icons/fi';
import {
  getOrderStatusStepIndex,
  getDeliveryEstimateText,
} from '../../utils/helpers';

const STEPS = [
  {key: 'confirmed', label: 'Confirmed', icon: FiClipboard},
  {key: 'processing', label: 'Processing', icon: FiPackage},
  {key: 'shipped', label: 'Shipped', icon: FiTruck},
  {key: 'delivered', label: 'Delivered', icon: FiHome},
];

export default function OrderStatusTracker({order}) {
  if (!order) return null;

  const {
    orderStatus,
    estimatedDelivery,
    trackingNumber,
    courier,
    cancellationReason,
  } = order;
  const currentStep = getOrderStatusStepIndex (orderStatus);
  const isCancelled = orderStatus === 'cancelled' || orderStatus === 'returned';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-100 p-6">
        <div className="flex items-center gap-3 mb-2">
          <FiXCircle size={22} className="text-red-500" />
          <p className="font-display text-xl text-red-700">
            {orderStatus === 'cancelled' ? 'Order Cancelled' : 'Order Returned'}
          </p>
        </div>
        {cancellationReason &&
          <p className="font-sans text-sm text-red-600/80 ml-9">
            {cancellationReason}
          </p>}
      </div>
    );
  }

  return (
    <div>
      {/* Delivery estimate banner */}
      <div className="bg-emerald-950/5 border border-emerald-900/15 px-5 py-4 mb-8 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FiTruck size={18} className="text-emerald-900" />
          <p className="font-sans text-sm text-luxury-dark font-medium">
            {getDeliveryEstimateText (estimatedDelivery, orderStatus)}
          </p>
        </div>
        {trackingNumber &&
          <p className="font-sans text-xs text-luxury-muted">
            Tracking:
            {' '}
            <span className="text-emerald-900 font-semibold">
              {trackingNumber}
            </span>
            {' '}
            {courier && `· ${courier}`}
          </p>}
      </div>

      {/* Step tracker */}
      {/* Step tracker */}
      <div className="relative px-2">
        {/* Background line */}
        <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-gray-200" />

        {/* Active line */}
        <div
          className="absolute top-5 left-[12%] h-[2px] bg-emerald-900 transition-all duration-500"
          style={{
            width: currentStep === 0
              ? '0%'
              : currentStep === 1 ? '25%' : currentStep === 2 ? '50%' : '76%',
          }}
        />

        <div className="relative flex justify-between">
          {STEPS.map ((step, i) => {
            const isComplete = i <= currentStep;
            const isCurrent = i === currentStep;

            return (
              <div key={step.key} className="flex flex-col items-center w-16">
                <motion.div
                  initial={{scale: 0.8}}
                  animate={{scale: isCurrent ? 1.1 : 1}}
                  transition={{duration: 0.4}}
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${isComplete ? 'bg-emerald-900 text-white' : 'bg-white border-2 border-gray-200 text-gray-300'}`}
                >
                  {isComplete && !isCurrent
                    ? <FiCheck size={16} />
                    : <step.icon size={15} />}
                </motion.div>

                <p
                  className={`mt-2 text-[11px] text-center ${isComplete ? 'text-emerald-900 font-medium' : 'text-gray-400'}`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
