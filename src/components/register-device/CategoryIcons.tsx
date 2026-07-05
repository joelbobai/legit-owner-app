import Svg, { Circle, Path, Rect } from "react-native-svg";

type Props = { size?: number; color?: string };

const C = "#1A56FF";

export function SmartphoneIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="6" y="2" width="16" height="24" rx="3.5" stroke={C} strokeWidth="1.8" fill="none" />
      <Circle cx="14" cy="22" r="1.3" fill={C} />
      <Rect x="10" y="5" width="8" height="1.5" rx="0.75" fill={C} opacity="0.4" />
    </Svg>
  );
}

export function LaptopIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="4" y="5" width="20" height="14" rx="2.5" stroke={C} strokeWidth="1.8" fill="none" />
      <Path d="M2 20H26" stroke={C} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="10" y="20" width="8" height="2.5" rx="1" fill={C} opacity="0.35" />
    </Svg>
  );
}

export function TabletIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="4" y="2" width="20" height="24" rx="3" stroke={C} strokeWidth="1.8" fill="none" />
      <Circle cx="14" cy="23" r="1.2" fill={C} />
      <Rect x="8" y="5.5" width="12" height="14" rx="1.5" fill={C} opacity="0.1" stroke={C} strokeWidth="1.2" />
    </Svg>
  );
}

export function SmartwatchIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="8" y="7" width="12" height="14" rx="4" stroke={C} strokeWidth="1.8" fill="none" />
      <Path d="M10 7V5H18V7" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 21V23H18V21" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 11V14L16 15.5" stroke={C} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GamingIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M4 14C4 10.7 6 8 9 7H19C22 8 24 10.7 24 14C24 18 21 21 18 21H10C7 21 4 18 4 14Z" stroke={C} strokeWidth="1.7" fill="none" />
      <Path d="M10 12V16M8 14H12" stroke={C} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="18" cy="13" r="1.2" fill={C} />
      <Circle cx="20.5" cy="15" r="1.2" fill={C} />
      <Circle cx="18" cy="17" r="1.2" fill={C} />
      <Circle cx="15.5" cy="15" r="1.2" fill={C} />
    </Svg>
  );
}

export function CameraIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M3 9C3 7.9 3.9 7 5 7H8L10 4H18L20 7H23C24.1 7 25 7.9 25 9V22C25 23.1 24.1 24 23 24H5C3.9 24 3 23.1 3 22V9Z" stroke={C} strokeWidth="1.7" fill="none" />
      <Circle cx="14" cy="15" r="4" stroke={C} strokeWidth="1.6" fill="none" />
      <Circle cx="14" cy="15" r="1.8" fill={C} opacity="0.3" />
    </Svg>
  );
}

export function DesktopIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="2" y="3" width="24" height="17" rx="2.5" stroke={C} strokeWidth="1.8" fill="none" />
      <Path d="M9 24H19M14 20V24" stroke={C} strokeWidth="1.7" strokeLinecap="round" />
      <Rect x="5" y="6" width="18" height="11" rx="1.5" fill={C} opacity="0.08" />
    </Svg>
  );
}

export function OtherIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke={C} strokeWidth="1.7" fill="none" strokeLinejoin="round" />
      <Path d="M14 3V25M3 8.5L14 14L25 8.5" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M8.5 5.8L19.5 11.2" stroke={C} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </Svg>
  );
}

export const CATEGORY_ICON_MAP: Record<string, React.ComponentType<Props>> = {
  smartphone: SmartphoneIcon,
  laptop: LaptopIcon,
  tablet: TabletIcon,
  smartwatch: SmartwatchIcon,
  gaming: GamingIcon,
  camera: CameraIcon,
  desktop: DesktopIcon,
  other: OtherIcon,
};
