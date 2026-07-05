import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

const { width: SW, height: SH } = Dimensions.get('window');

export function DotGrid({ id, opacity = 0.4 }: { id: string; opacity?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SW} height={SH} opacity={opacity}>
        <Defs>
          <Pattern
            id={id}
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width={SW} height={SH} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
