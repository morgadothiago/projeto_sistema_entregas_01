import { colors } from "@/app/theme"
import { Feather } from "@expo/vector-icons"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"

type HeaderProps = {
  title?: string
  onBackPress?: () => void
  tabs?: boolean
  tabsTitle?: string
  buttonBackIcon?: boolean
}

export function Header({
  title,
  onBackPress,
  tabs,
  tabsTitle,
  buttonBackIcon,
}: HeaderProps) {
  return (
    <View style={[styles.container, tabs && styles.tabs]}>
      {buttonBackIcon && (
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Feather
            name="arrow-left"
            size={35}
            color={tabs ? colors.buttons : colors.buttons}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, tabs && styles.tabsTitile]}>
        {tabs ? tabsTitle : title}
      </Text>
    </View>
  )
}
