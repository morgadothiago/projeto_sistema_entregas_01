import React, { useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import {
  Text,
  View,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { colors } from "@/app/theme"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Header } from "../../components/Header"
import { ApiOrder } from "../../types/order"
import { api } from "../../service/api"
import { useAuth } from "../../context/AuthContext"
import { Feather } from "@expo/vector-icons"
// botão customizado removido (usamos TouchableOpacity para ações nesta tela)
import * as Location from "expo-location"

export default function DeliveryDetails() {
  const insets = useSafeAreaInsets()
  const { code } = useLocalSearchParams()
  const { token, signOut } = useAuth()
  const [deliveryDetails, setDeliveryDetails] = useState<ApiOrder | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (!token) {
          // força logout se não houver token
          signOut()
          return
        }
        if (!code) return

        const response = await api.get(`/delivery`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { code: code },
        })
        if (cancelled) return
        setDeliveryDetails(response.data.data[0])
      } catch (error) {
        console.error("Erro ao buscar entrega:", error)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token, code, signOut])

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

  function handleCheckoutPress() {
    console.log("Finalizar entrega")
  }

  if (!deliveryDetails) {
    return (
      <SafeAreaView style={localStyles.container}>
        <Header title="Detalhes da Entrega" />
        <View style={localStyles.contentCenter}>
          <Text style={localStyles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const statusLabel =
    deliveryDetails.status === "DELIVERED" ? "Concluída" : "Pendente"

  return (
    <SafeAreaView style={localStyles.container}>
      <Header title="Detalhes da Entrega" />

      <View style={localStyles.content}>
        <ScrollView contentContainerStyle={localStyles.scrollContent}>
          {/* Cabeçalho com nome e status */}
          <View style={localStyles.headerCard}>
            <View style={localStyles.headerLeft}>
              <Text style={localStyles.companyName}>
                {deliveryDetails.Company?.name}
              </Text>
              <Text style={localStyles.smallText}>{deliveryDetails.code}</Text>
            </View>
            <View style={localStyles.statusBadgeContainer}>
              <View
                style={[
                  localStyles.statusBadge,
                  {
                    backgroundColor:
                      deliveryDetails.status === "DELIVERED"
                        ? "#d4edda"
                        : "#fff3cd",
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      deliveryDetails.status === "DELIVERED"
                        ? "#155724"
                        : "#856404",
                    fontWeight: "700",
                  }}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>

          {/* Card: detalhes do pedido */}
          <View style={localStyles.card}>
            <Text style={localStyles.cardTitle}>Detalhes da Encomenda</Text>

            <DetailRow label="Empresa" value={deliveryDetails.Company?.name} />
            <DetailRow
              label="Endereço"
              value={deliveryDetails.Company?.andress}
            />
            <DetailRow
              label="Telefone"
              value={deliveryDetails.Company?.phone}
            />
            <DetailRow
              label="Tipo de Veículo"
              value={deliveryDetails.vehicleType}
            />

            <View style={localStyles.rowGroup}>
              <DetailRow
                label="Dimensões (AxLxC)"
                value={`${deliveryDetails.height} x ${deliveryDetails.width} x ${deliveryDetails.length}`}
                compact
              />
              <DetailRow
                label="Peso"
                value={`${deliveryDetails.weight} kg`}
                compact
              />
            </View>

            <DetailRow
              label="Fragilidade"
              value={deliveryDetails.isFragile ? "Sim" : "Não"}
            />
            <DetailRow label="Preço" value={`R$ ${deliveryDetails.price}`} />
          </View>
          <View
            style={{
              marginTop: 24,
              marginBottom: 2,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Feather name="info" size={20} color={colors.primary} />
            <Text>Ações Rápidas</Text>
          </View>
          {/* Ações rápidas */}
          <View
            style={[
              localStyles.footer,
              { paddingBottom: insets.bottom ? insets.bottom + 18 : 16 },
            ]}
          >
            <TouchableOpacity
              style={localStyles.footerButton}
              onPress={handleGolMapPress}
            >
              <Text style={localStyles.footerButtonText}>Ver no mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.footerButton, localStyles.primaryButton]}
              onPress={handleCheckoutPress}
            >
              <Text
                style={[
                  localStyles.footerButtonText,
                  { color: colors.primary },
                ]}
              >
                Finalizar Entrega
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Rodapé fixo com ações principais */}
      </View>
    </SafeAreaView>
  )
}

// Peça visual para linhas de detalhe
function DetailRow({
  label,
  value,
  compact,
}: {
  label: string
  value?: string | number | null
  compact?: boolean
}) {
  return (
    <View
      style={[localStyles.detailRow, compact && localStyles.detailRowCompact]}
    >
      <Text style={localStyles.detailLabel}>{label}</Text>
      <Text style={localStyles.detailValue}>{value ?? "-"}</Text>
    </View>
  )
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  contentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  loadingText: {
    color: colors.secondary,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.secondary,
  },
  smallText: {
    color: colors.secondary,
    opacity: 0.8,
    marginTop: 4,
  },
  statusBadgeContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.support,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
    marginBottom: 8,
  },
  detailRow: {
    marginTop: 8,
  },
  detailRowCompact: {
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.secondary,
    opacity: 0.9,
  },
  detailValue: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: "600",
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 28,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.support,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  callButton: {
    backgroundColor: colors.support,
  },
  outlineButton: {
    backgroundColor: "transparent",
  },
  raised: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  footerButton: {
    flex: 1,
    backgroundColor: colors.support,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: colors.active,
  },
  footerButtonText: {
    color: colors.secondary,
    fontWeight: "700",
  },
})
