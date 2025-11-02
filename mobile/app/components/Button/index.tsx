import React from "react"
import { Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native"
import { styles } from "./styles"
import { Feather } from "@expo/vector-icons"

type ButtonProps = {
  title?: string
  onPress?: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  icon?: keyof typeof Feather.glyphMap
  sizeIcon?: number
  colorIcon?: string
}
export function Button({
  icon,
  title,
  onPress,
  disabled,
  style,
  sizeIcon,
  colorIcon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, disabled && { opacity: 0.6 }, style]}
      disabled={disabled}
    >
      {icon && <Feather name={icon} size={sizeIcon} color={colorIcon} />}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}
