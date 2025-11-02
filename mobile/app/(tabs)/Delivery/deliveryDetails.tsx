import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  Text,
  View,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  ScrollView,
} from "react-native"
import { colors } from "@/app/theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "../../components/Header"
import { ApiOrder } from "../../types/order"
import { api } from "../../service/api"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/Button"
import * as Location from "expo-location"

export default function DeliveryDetails() {
  const router = useRouter()
  const { code } = useLocalSearchParams()
  const { token, signOut } = useAuth()
  const [deliveryDetails, setDeliveryDetails] = useState<ApiOrder | null>(null)

  function logOut() {
    signOut()
  }

  useEffect(() => {
    if (!token) {
      logOut()
      return
    }
    GetDeliveryDetails()
  }, [token])

  async function GetDeliveryDetails() {
    try {
      if (!code || !token) return

      const response = await api.get(`/delivery`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { code: code },
      })
      setDeliveryDetails(response.data.data[0])
    } catch (error) {
      console.error("Erro ao buscar entrega:", error)
    }
  }

  async function handleGolMapPress() {
    try {
      // Pede permissão para acessar localização
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para abrir o mapa."
        )
        return
      }

      // Pega a localização atual
      const location = await Location.getCurrentPositionAsync({})
      const originLat = location.coords.latitude
      const originLng = location.coords.longitude

      // Destino da entrega (pega do deliveryDetails se existir)
      const destination = {
        latitude: -23.642533369211442,
        longitude: -46.732898531204846,
      }

      if (Platform.OS === "ios") {
        // iOS: abre Apple Maps
        const appleUrl = `http://maps.apple.com/?saddr=${originLat},${originLng}&daddr=${destination.latitude},${destination.longitude}&dirflg=d`
        Linking.openURL(appleUrl)
      } else {
        // Android: tenta abrir Google Maps nativo
        const googleUrl = `google.navigation:q=${destination.latitude},${destination.longitude}&mode=d`
        const supported = await Linking.canOpenURL(googleUrl)
        if (supported) {
          Linking.openURL(googleUrl)
        } else {
          // fallback web
          const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`
          Linking.openURL(webUrl)
        }
      }
    } catch (error) {
      console.error("Erro ao abrir o mapa:", error)
      Alert.alert("Erro", "Não foi possível abrir o mapa.")
    }
  }

  if (!deliveryDetails) {
    return (
      <SafeAreaView style={localStyles.container}>
        <Header title="Detalhes da Entrega" />
        <View style={localStyles.content}>
          <Text style={localStyles.message}>
            Carregando detalhes da entrega...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const statusColor =
    deliveryDetails.status === "DELIVERED" ? "green" : "orange"
  const statusLabel =
    deliveryDetails.status === "DELIVERED" ? "Concluída" : "Pendente"

  return (
    <SafeAreaView style={localStyles.container}>
      <Header title="Detalhes da Entrega" />
      <View style={localStyles.content}>
        <Text style={localStyles.message}>{deliveryDetails.Company?.name}</Text>

        <ScrollView>
          <View style={localStyles.detailsContainer}>
            <Text style={localStyles.sectionTitle}>Detalhes da Encomenda</Text>
            <Text style={localStyles.label}>ID da Entrega:</Text>
            <Text style={localStyles.value}>{deliveryDetails.code}</Text>

            <Text style={localStyles.label}>Empresa:</Text>
            <Text style={localStyles.value}>
              {deliveryDetails.Company?.name}
            </Text>

            <Text style={localStyles.label}>Endereço da Empresa:</Text>
            <Text style={localStyles.value}>
              {deliveryDetails.Company?.andress}
            </Text>

            <Text style={localStyles.label}>Telefone da Empresa:</Text>
            <Text style={localStyles.value}>
              {deliveryDetails.Company?.phone}
            </Text>

            <Text style={localStyles.label}>Tipo de Veículo:</Text>
            <Text style={localStyles.value}>{deliveryDetails.vehicleType}</Text>

            <Text style={localStyles.label}>Dimensões (AxLxC):</Text>
            <Text style={localStyles.value}>
              {deliveryDetails.height} x {deliveryDetails.width} x{" "}
              {deliveryDetails.length}
            </Text>

            <Text style={localStyles.label}>Peso:</Text>
            <Text style={localStyles.value}>{deliveryDetails.weight} kg</Text>

            <Text style={localStyles.label}>Fragilidade:</Text>
            <Text style={localStyles.value}>
              {deliveryDetails.isFragile ? "Sim" : "Não"}
            </Text>

            <Text style={localStyles.label}>Preço:</Text>
            <Text style={localStyles.value}>R$ {deliveryDetails.price}</Text>

            <Text style={localStyles.label}>Status:</Text>
            <Text style={[localStyles.value, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>

          <Button
            title="Ver no mapa"
            onPress={handleGolMapPress}
            style={localStyles.button}
            icon="map-pin"
            sizeIcon={20}
            colorIcon={colors.secondary}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.secondary,
  },
  detailsContainer: {
    backgroundColor: colors.support,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: colors.secondary,
  },
  message: {
    marginBottom: 12,
    color: colors.secondary,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: colors.active,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
})
