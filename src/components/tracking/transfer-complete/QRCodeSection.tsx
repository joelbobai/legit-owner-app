import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

function ShieldLogoSvg() {
  return (
    <Svg width={24} height={24} viewBox="0 0 40 40" fill="none">
      <Path d="M20 3L6 9V18C6 27 12 34 20 37C28 34 34 27 34 18V9L20 3Z" fill="#1A56FF" stroke="#1A56FF" strokeWidth="1.5" />
      <Rect x={15} y={13} width={10} height={16} rx={2} stroke="white" strokeWidth="1.8" fill="none" />
      <Circle cx={20} cy={26} r={1} fill="white" />
      <Path d="M16 10L14 8" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M24 10L26 8" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function QRCode({ size = 120 }: { size?: number }) {
  const grid = 21;
  const px = size / grid;
  const cells: [number, number][] = [];

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const inFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      if (inFinder) continue;
      const v = (r * 31 + c * 17 + (r ^ c) * 5) % 7;
      if (v < 3) cells.push([r, c]);
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect width={size} height={size} fill="white" />
      {cells.map(([r, c], i) => (
        <Rect key={i} x={c * px} y={r * px} width={px} height={px} fill="#0D0D0D" />
      ))}
      {[
        [0, 0],
        [0, 14],
        [14, 0],
      ].map(([r, c], i) => (
        <React.Fragment key={i}>
          <Rect x={c * px} y={r * px} width={7 * px} height={7 * px} fill="#0D0D0D" />
          <Rect x={(c + 1) * px} y={(r + 1) * px} width={5 * px} height={5 * px} fill="white" />
          <Rect x={(c + 2) * px} y={(r + 2) * px} width={3 * px} height={3 * px} fill="#1A56FF" />
        </React.Fragment>
      ))}
      <Rect x={size / 2 - 16} y={size / 2 - 16} width={32} height={32} rx={8} fill="white" />
    </Svg>
  );
}

const QRCodeSection = React.memo(function QRCodeSection({ size = 120 }: { size?: number }) {
  return <QRCode size={size} />;
});

export { QRCode, ShieldLogoSvg };
export default QRCodeSection;
