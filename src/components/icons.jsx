export function IconWrap({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const GlobeIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.6 4 5.8 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.8-4-9s1.4-6.4 4-9Z" />
  </IconWrap>
)

export const InstagramIcon = () => (
  <IconWrap>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </IconWrap>
)

export const MapPinIcon = () => (
  <IconWrap>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </IconWrap>
)

export const ChatIcon = () => (
  <IconWrap>
    <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-5.1a8.5 8.5 0 0 1-.9-3.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
  </IconWrap>
)

export const PhoneIcon = () => (
  <IconWrap>
    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.4c1 .3 2.1.5 3.1.5a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5C10.4 21.5 2.5 13.6 2.5 4.5A1.5 1.5 0 0 1 4 3h3.2a1.5 1.5 0 0 1 1.5 1.5c0 1 .2 2.1.5 3.1a1.5 1.5 0 0 1-.4 1.5L6.6 10.8Z" />
  </IconWrap>
)

export const ChevronIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const SparkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.85 3.4 1.55 6.05 2.35 6.85.8.8 3.45 1.5 6.85 2.35-3.4.85-6.05 1.55-6.85 2.35-.8.8-1.5 3.45-2.35 6.85-.85-3.4-1.55-6.05-2.35-6.85-.8-.8-3.45-1.5-6.85-2.35 3.4-.85 6.05-1.55 6.85-2.35.8-.8 1.5-3.45 2.35-6.85Z" />
  </svg>
)

export const ScissorsIcon = () => (
  <IconWrap>
    <circle cx="6" cy="6" r="2.4" />
    <circle cx="6" cy="18" r="2.4" />
    <path d="M8.2 7.4 20 18" />
    <path d="M8.2 16.6 20 6" />
  </IconWrap>
)

export const DropletIcon = () => (
  <IconWrap>
    <path d="M12 3s6 7.4 6 12a6 6 0 0 1-12 0c0-4.6 6-12 6-12Z" />
  </IconWrap>
)

export const WaveIcon = () => (
  <IconWrap>
    <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 14.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </IconWrap>
)

export const GemIcon = () => (
  <IconWrap>
    <path d="M5 9 9 3h6l4 6-7 12L5 9Z" />
    <path d="M5 9h14" />
    <path d="M9 3l3 6 3-6" />
  </IconWrap>
)

export const FlowerIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="2.1" />
    <path d="M12 9.9C12 7.2 10.3 5.2 9 4.2c0 1.8 1 3.7 3 5.7Z" />
    <path d="M12 9.9c0-2.7 1.7-4.7 3-5.7 0 1.8-1 3.7-3 5.7Z" />
    <path d="M14.1 12c2.7 0 4.7-1.7 5.7-3-1.8 0-3.7 1-5.7 3Z" />
    <path d="M14.1 12c2.7 0 4.7 1.7 5.7 3-1.8 0-3.7-1-5.7-3Z" />
    <path d="M12 14.1c0 2.7-1.7 4.7-3 5.7 0-1.8 1-3.7 3-5.7Z" />
    <path d="M12 14.1c0 2.7 1.7 4.7 3 5.7 0-1.8-1-3.7-3-5.7Z" />
    <path d="M9.9 12c-2.7 0-4.7 1.7-5.7 3 1.8 0 3.7-1 5.7-3Z" />
    <path d="M9.9 12c-2.7 0-4.7-1.7-5.7-3 1.8 0 3.7 1 5.7 3Z" />
  </IconWrap>
)

export const LipstickIcon = () => (
  <IconWrap>
    <path d="M9 21v-7h6v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" />
    <path d="M9 14 10 4h4l1 10Z" />
    <path d="M10.3 4c.3-1.3 1-2.2 1.7-2.2s1.4.9 1.7 2.2" />
  </IconWrap>
)

export const GiftIcon = () => (
  <IconWrap>
    <rect x="3" y="9" width="18" height="12" rx="1.5" />
    <path d="M3 13h18M12 9v12" />
    <path d="M12 9C9.5 9 8 7.5 8 6a2.5 2.5 0 0 1 4-2 2.5 2.5 0 0 1 4 2c0 1.5-1.5 3-4 3Z" />
  </IconWrap>
)

export const BrushIcon = () => (
  <IconWrap>
    <path d="M18.5 3.5 20.5 5.5 11.5 14.5l-2-2Z" />
    <path d="M9.5 12.5c-1.6 0-3.1.6-4.1 1.8C4.2 15.7 3.8 17.8 4 20c1.8.4 4-.1 5.3-1.4 1.1-1.1 1.7-2.5 1.7-4" />
  </IconWrap>
)
