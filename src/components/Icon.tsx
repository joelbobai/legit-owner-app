import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export function ArrowLeftIcon({ size = 24, color = '#0D0D0D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M5 10H15M15 10L9 4M15 10L9 16" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M5 8L10 13L15 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = '#CBD5E1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M8 5L13 10L8 15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Form field icons ─────────────────────────────────────────────────────────

export function UserIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="7" r="4" stroke={color} strokeWidth="1.6" />
      <Path d="M2 17C2 14 5.6 12 10 12C14.4 12 18 14 18 17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

export function UserCircleIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" />
      <Circle cx="10" cy="8" r="3" stroke={color} strokeWidth="1.4" />
      <Path d="M4 16.5C4 14 6.7 12.5 10 12.5C13.3 12.5 16 14 16 16.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function UserPlusIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="8" cy="7" r="4" stroke={color} strokeWidth="1.7" fill="none" />
      <Path d="M1 17C1 14.2 4.1 12 8 12" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Path d="M15 12V18M12 15H18" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function LockIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="4" y="9" width="12" height="9" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M7 9V7C7 5.3 8.3 4 10 4C11.7 4 13 5.3 13 7V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="10" cy="13.5" r="1.2" fill={color} />
    </Svg>
  );
}

export function EyeIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke={color} strokeWidth="1.5" />
      <Circle cx="10" cy="10" r="2.5" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function EyeSlashIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke={color} strokeWidth="1.5" />
      <Circle cx="10" cy="10" r="2.5" stroke={color} strokeWidth="1.5" />
      <Path d="M3 3L17 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function EnvelopeIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M2 7L10 12L18 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2" y="4" width="16" height="14" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
      <Path d="M6 2V5M14 2V5M2 9H18" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function LocationPinIcon({ size = 20, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M10 2C7.2 2 5 4.2 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4.2 12.8 2 10 2Z" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="10" cy="7" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

// ─── Action icons ─────────────────────────────────────────────────────────────

export function SendIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M17 3L10 17L8 11L2 9Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    </Svg>
  );
}

export function RefreshCircleIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M18 10C18 10 15 4 10 4C7.5 4 5.3 5.3 4 7M2 10C2 10 5 16 10 16C12.5 16 14.7 14.7 16 13"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LoginIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M8 3H4C2.9 3 2 3.9 2 5V15C2 16.1 2.9 17 4 17H8" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Path d="M13 7L17 10L13 13" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M17 10H8" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function CloudUploadIcon({ size = 36, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path d="M12 22L18 16L24 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 16V28" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M10 26C7.8 26 6 24.2 6 22C6 20 7.4 18.3 9.3 18C9.1 17.4 9 16.7 9 16C9 12.7 11.7 10 15 10C16.4 10 17.7 10.5 18.7 11.3C19.7 9.9 21.2 9 23 9C25.8 9 28 11.2 28 14C28 14.3 27.97 14.6 27.93 14.9C29.7 15.4 31 17 31 19C31 21.2 29.2 23 27 23"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function FingerprintIcon({ size = 24, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.7 2 5.8 3.7 4 6.3" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M20 6.3C18.2 3.7 15.3 2 12 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M4.5 9.5C4.2 10.3 4 11.1 4 12C4 14.5 5.1 16.8 6.8 18.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M19.5 9.5C19.8 10.3 20 11.1 20 12C20 14 19.2 15.8 17.8 17.1" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M12 8C9.8 8 8 9.8 8 12C8 14.5 9.3 16.8 11.2 18.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M16 12C16 9.8 14.2 8 12 8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M12 12C12 14 12.7 15.8 13.8 17.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Status / indicator icons ─────────────────────────────────────────────────

export function CheckCircleIcon({ size = 20, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" fill={color} />
      <Path d="M6.5 10L9 12.5L13.5 7.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CheckmarkIcon({ size = 10, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Polyline points="2,5 4,7 8,3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldCheckIcon({ size = 16, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 1.5L13.5 4V8.5C13.5 11.5 11 14 8 15C5 14 2.5 11.5 2.5 8.5V4Z" fill={color} />
      <Path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldCheckOutlineIcon({ size = 16, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 1.5L13.5 4V8.5C13.5 11.5 11 14 8 15C5 14 2.5 11.5 2.5 8.5V4Z" stroke={color} strokeWidth="1.3" />
      <Path d="M5.5 8L7 9.5L10.5 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LockBadgeIcon({ size = 16, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x="3" y="7" width="10" height="7" rx="1.5" fill={color} />
      <Path d="M5.5 7V5C5.5 3.6 6.6 2.5 8 2.5C9.4 2.5 10.5 3.6 10.5 5V7" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <Circle cx="8" cy="10.5" r="1" fill="white" />
    </Svg>
  );
}

// ─── UI control icons ─────────────────────────────────────────────────────────

export function SearchIcon({ size = 22, color = '#0D0D0D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="9.5" cy="9.5" r="6.5" stroke={color} strokeWidth="1.8" />
      <Path d="M14 14L19 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 22, color = '#0D0D0D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M11 3C7.7 3 5 5.7 5 9V14L3 16H19L17 14V9C17 5.7 14.3 3 11 3Z" stroke={color} strokeWidth="1.7" />
      <Path d="M9 16C9 17.1 9.9 18 11 18C12.1 18 13 17.1 13 16" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function HelpIcon({ size = 16, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9 7.5 8 8V9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Circle cx="8" cy="11.5" r="0.7" fill={color} />
    </Svg>
  );
}

export function InfoIcon({ size = 14, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1.2" />
      <Path d="M7 6V10" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Circle cx="7" cy="4.5" r="0.6" fill={color} />
    </Svg>
  );
}

export function ClockIcon({ size = 16, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3" />
      <Path d="M8 5V8L10 10" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

// ─── App-specific icons ───────────────────────────────────────────────────────

export function ScanFrameIcon({ size = 32, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M5 12V7C5 6 6 5 7 5H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M27 12V7C27 6 26 5 25 5H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M5 20V25C5 26 6 27 7 27H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M27 20V25C27 26 26 27 25 27H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="5" y1="16" x2="27" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function SmartphoneIcon({ size = 24, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="1.7" />
      <Circle cx="12" cy="18" r="1" fill={color} />
    </Svg>
  );
}

export function AddCircleIcon({ size = 24, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
      <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function TransferIcon({ size = 22, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M5 8L11 4L17 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 14L11 18L5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11 4V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function AlertShieldIcon({ size = 24, color = '#DC2626' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L20 7V13C20 17.5 16.5 21 12 22.5C7.5 21 4 17.5 4 13V7Z" stroke={color} strokeWidth="1.7" />
      <Path d="M12 9V13" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="0.8" fill={color} />
    </Svg>
  );
}

export function StarVerifiedIcon({ size = 16, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 1L10 3.5H13L11.5 6L13 8.5H10L8 11L6 8.5H3L4.5 6L3 3.5H6Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <Path d="M5.5 6L7 7.5L10.5 4.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── ID document icons (Step2) ────────────────────────────────────────────────

export function NinCardIcon({ size = 24, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="8" cy="12" r="2.5" stroke={color} strokeWidth="1.4" fill="none" />
      <Path d="M13 10H19M13 13H17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function VotersCardIcon({ size = 24, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="15" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="12" cy="20" r="3" stroke={color} strokeWidth="1.4" fill="none" />
      <Path d="M9 20H15M7 8H17M7 12H13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function PassportBookIcon({ size = 24, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="12" cy="11" r="3" stroke={color} strokeWidth="1.4" fill="none" />
      <Path d="M7 17H17M7 6H10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function DriversLicenseIcon({ size = 24, color = '#94A3B8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 11L7 6H17L19 11" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <Rect x="3" y="11" width="18" height="7" rx="2" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="7.5" cy="18" r="2" stroke={color} strokeWidth="1.4" fill="none" />
      <Circle cx="16.5" cy="18" r="2" stroke={color} strokeWidth="1.4" fill="none" />
    </Svg>
  );
}

export function FilterListIcon({ size = 20, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M4 6H16M6 10H14M9 14H11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

export function SortArrowsIcon({ size = 16, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M5 3V13M5 13L2 10M5 13L8 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11 13V3M11 3L8 6M11 3L14 6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CopyIcon({ size = 14, color = '#1A56FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Rect x="3" y="5" width="8" height="8" rx="1" stroke={color} strokeWidth="1.2" fill="none" />
      <Path d="M3 3H10C10.6 3 11 3.4 11 4" stroke={color} strokeWidth="1.2" fill="none" />
    </Svg>
  );
}

export function GridIcon({ size = 14, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Rect x="2" y="2" width="4" height="4" rx="1" fill={color} />
      <Rect x="8" y="2" width="4" height="4" rx="1" fill={color} />
      <Rect x="2" y="8" width="4" height="4" rx="1" fill={color} />
      <Rect x="8" y="8" width="4" height="4" rx="1" fill={color} />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M10 6V14M6 10H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
