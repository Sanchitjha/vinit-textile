const offers = [
  { text: 'Get extra 5% off Use:', code: 'FLASH5', suffix: 'on Min. ₹2490' },
  { text: 'Save More ! Use:', code: 'VINIT10', suffix: 'for extra 10% discount' },
  { text: 'Free Shipping on orders above ₹1,999', code: '', suffix: '' },
  { text: 'Festival Special ! Use:', code: 'FESTIVE15', suffix: '& Get extra 15% Off' },
  { text: 'Special Offer ! Use:', code: 'WELCOME5', suffix: 'on your order' },
]

export default function AnnouncementTicker() {
  const renderOffers = () =>
    offers.map((offer, i) => (
      <span key={i} className="inline-flex items-center gap-1.5 whitespace-nowrap px-4">
        <span>{offer.text}</span>
        {offer.code && (
          <span className="font-bold text-[#E53935] tracking-wider">{offer.code}</span>
        )}
        {offer.suffix && <span>{offer.suffix}</span>}
        <span className="ml-4 text-gray-300">|</span>
      </span>
    ))

  return (
    <div className="bg-[#FFE8E3] border-b border-[#F7D0C8] overflow-hidden py-2 select-none">
      <div className="ticker-track flex hover:[animation-play-state:paused]">
        <div className="ticker-content flex items-center text-xs sm:text-sm font-medium text-[#4A2E2B] tracking-wide shrink-0">
          {renderOffers()}
        </div>
        <div className="ticker-content flex items-center text-xs sm:text-sm font-medium text-[#4A2E2B] tracking-wide shrink-0" aria-hidden="true">
          {renderOffers()}
        </div>
      </div>
    </div>
  )
}
