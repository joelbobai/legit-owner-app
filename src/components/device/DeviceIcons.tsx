import Svg, { Circle, Path, Rect } from "react-native-svg";

type IconProps = { size?: number; color?: string };

export function ArrowLeft({ size = 24, color = "#0D0D0D" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Share({ size = 20, color = "#1A56FF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M14 3L10 7M14 3V7M14 3H10" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 7H4C3.4 7 3 7.4 3 8V16C3 16.6 3.4 17 4 17H16C16.6 17 17 16.6 17 16V8C17 7.4 16.6 7 16 7H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M10 3V13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M7 6L10 3L13 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DeviceMobile({ size = 100, color = "#1A56FF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Rect x="28" y="8" width="64" height="104" rx="12" stroke={color} strokeWidth="3.5" fill="none" />
      <Circle cx="60" cy="101" r="5" fill={color} opacity="0.5" />
      <Rect x="46" y="20" width="28" height="5" rx="2.5" fill={color} opacity="0.3" />
      <Rect x="36" y="34" width="48" height="36" rx="4" fill={color} opacity="0.06" />
      <Path d="M48 44L60 38L72 44V56C72 60 67 63 60 65C53 63 48 60 48 56V44Z" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
      <Path d="M55 52L58.5 55.5L65 48" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </Svg>
  );
}

export function MapPin({ size = 22, color = "#F59E0B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.7 2 6 4.7 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.7 15.3 2 12 2Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.8" />
      <Circle cx="12" cy="8" r="2.5" fill={color} />
    </Svg>
  );
}

export function ShieldWarning({ size = 22, color = "#DC2626" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.8" />
      <Path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1" fill={color} />
    </Svg>
  );
}

export function ArrowsLeftRight({ size = 22, color = "#1A56FF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8H20M17 5L20 8L17 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 16H4M7 13L4 16L7 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Certificate({ size = 22, color = "#16A34A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M7 8H17M7 11H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="12" cy="20" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M9 20H15" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function Pencil({ size = 22, color = "#1A56FF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 4L20 8L8 20H4V16L16 4Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M14 6L18 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function Clock({ size = 22, color = "#64748B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M12 7V12L15.5 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function QrCode({ size = 110 }: { size?: number }) {
  const s = size / 140;
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Rect x="8" y="8" width="124" height="124" rx="8" fill="#F8FAFF" stroke="#E2E8F0" strokeWidth="2" />
      <Rect x="18" y="18" width="40" height="40" rx="4" stroke="#0D0D0D" strokeWidth="3" fill="none" />
      <Rect x="26" y="26" width="24" height="24" rx="2" fill="#1A56FF" />
      <Rect x="82" y="18" width="40" height="40" rx="4" stroke="#0D0D0D" strokeWidth="3" fill="none" />
      <Rect x="90" y="26" width="24" height="24" rx="2" fill="#1A56FF" />
      <Rect x="18" y="82" width="40" height="40" rx="4" stroke="#0D0D0D" strokeWidth="3" fill="none" />
      <Rect x="26" y="90" width="24" height="24" rx="2" fill="#1A56FF" />
      {[
        [66, 18], [74, 18], [82, 18], [66, 26], [74, 26], [66, 34], [74, 34], [82, 34],
        [18, 66], [26, 66], [34, 66], [18, 74], [34, 74], [18, 82], [26, 82],
        [66, 66], [82, 66], [90, 66], [98, 66], [66, 74], [98, 74], [66, 82], [74, 82], [90, 82], [98, 82],
        [66, 90], [74, 90], [82, 90], [66, 98], [82, 98], [90, 98], [98, 98],
        [50, 50], [58, 50], [50, 58],
        [74, 50], [82, 50], [90, 50], [74, 58], [90, 58], [82, 66],
        [50, 66], [50, 74], [58, 74], [50, 82], [58, 82],
      ].map(([x, y], i) => (
        <Rect key={i} x={x} y={y} width="6" height="6" rx="1" fill={i % 3 === 0 ? "#1A56FF" : "#0D0D0D"} opacity={i % 3 === 0 ? 0.7 : 0.85} />
      ))}
      <Rect x="57" y="57" width="26" height="26" rx="5" fill="white" />
      <Path d="M65 65L70 60L75 65V72C75 74.5 72.8 76.5 70 77.5C67.2 76.5 65 74.5 65 72V65Z" fill="#1A56FF" opacity="0.85" />
      <Path d="M68 70L70 72L73 68" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function WhatsApp({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="10" fill="#25D366" opacity="0.12" />
      <Circle cx="11" cy="11" r="10" stroke="#25D366" strokeWidth="1.4" />
      <Path d="M7 15L8.5 13.8C9.3 14.4 10.1 14.8 11 14.8C13.3 14.8 15 13.1 15 11C15 8.9 13.3 7.2 11 7.2C8.7 7.2 7 8.9 7 11C7 11.9 7.3 12.7 7.8 13.4L7 15Z" stroke="#25D366" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

export function Email({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="10" fill="#1A56FF" opacity="0.1" />
      <Circle cx="11" cy="11" r="10" stroke="#1A56FF" strokeWidth="1.4" />
      <Rect x="6" y="7.5" width="10" height="7" rx="1.5" stroke="#1A56FF" strokeWidth="1.3" fill="none" />
      <Path d="M6 9L11 12L16 9" stroke="#1A56FF" strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

export function Save({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="10" fill="#16A34A" opacity="0.1" />
      <Circle cx="11" cy="11" r="10" stroke="#16A34A" strokeWidth="1.4" />
      <Path d="M11 7V14M8 11L11 14L14 11" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Print({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="10" fill="#64748B" opacity="0.1" />
      <Circle cx="11" cy="11" r="10" stroke="#64748B" strokeWidth="1.4" />
      <Rect x="7" y="8" width="8" height="6" rx="1" stroke="#64748B" strokeWidth="1.3" fill="none" />
      <Path d="M9 8V6H13V8" stroke="#64748B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14V17H13V14" stroke="#64748B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Stamp({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 2L10 5H14L11 7.5L12.2 11L8 8.5L3.8 11L5 7.5L2 5H6L8 2Z" fill="#1A56FF" opacity="0.2" stroke="#1A56FF" strokeWidth="1" strokeLinejoin="round" />
    </Svg>
  );
}

export function CaretDown({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M3 5L7 9L11 5" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CheckCircle({ size = 14, color = "#16A34A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="6" fill={color} opacity="0.12" />
      <Circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1.3" />
      <Path d="M4.5 7L6.2 8.7L9.5 5.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
