import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 120, showText = false }) => {
  const roundRadius = size * 0.15;
  const arrowStrokeWidth = Math.max(3, size * 0.05);
  const arrowSize = size * 0.35;

  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, { width: size, height: size }]}>
        {/* Rounded square background */}
        <View
          style={[
            styles.background,
            {
              width: size,
              height: size,
              borderRadius: roundRadius,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 6,
            },
          ]}
        >
          {/* Large "A" letter */}
          <Text style={[styles.letterA, { fontSize: size * 0.6, lineHeight: size * 0.58 }]} allowFontScaling={false}>A</Text>

          {/* Arrow removed by request - keeping A letter and growth bars */}

          {/* Small growth chart gadget at bottom-right */}
          <View
            style={[
              styles.gadgetContainer,
              {
                width: size * 0.32,
                height: size * 0.28,
                right: size * 0.08,
                bottom: size * 0.08,
              },
            ]}
          >
            {/* Chart bars */}
            <View
              style={[
                styles.chartBar,
                {
                  width: size * 0.06,
                  height: size * 0.1,
                  backgroundColor: '#7C3AED',
                },
              ]}
            />
            <View
              style={[
                styles.chartBar,
                {
                  width: size * 0.06,
                  height: size * 0.15,
                  backgroundColor: '#7C3AED',
                  marginLeft: size * 0.04,
                },
              ]}
            />
            <View
              style={[
                styles.chartBar,
                {
                  width: size * 0.06,
                  height: size * 0.2,
                  backgroundColor: '#06B6D4',
                  marginLeft: size * 0.04,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.appName}>Assetly</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterA: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'System',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  aLeftDiag: {
    backgroundColor: '#000000',
    position: 'absolute',
  },
  aRightDiag: {
    backgroundColor: '#000000',
    position: 'absolute',
  },
  aCrossbar: {
    backgroundColor: '#000000',
    position: 'absolute',
  },
  /* arrow styles removed - arrow was removed from markup */
  gadgetContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 2,
    paddingRight: 2,
  },
  chartBar: {
    borderRadius: 1,
  },
  textContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
});
