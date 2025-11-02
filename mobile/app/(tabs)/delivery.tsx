import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { DeliveryItem } from "../components/DeliveryItem"
import { Header } from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { api } from "../service/api"
import { colors } from "../theme"
import { ApiOrder } from "../types/order"

export default function Delivery() {
  const { token, loading } = useAuth()

  const router = useRouter()
  const [orders, setOrders] = useState<ApiOrder[]>([])

  useEffect(() => {
    let mounted = true

    // não faz nada enquanto o auth ainda carrega o estado inicial
    if (loading) return

    if (!token) {
      // redireciona para a tela de login se não houver token
      router.replace("/(auth)/Signin")
      return
    }

    ;(async () => {
      try {
        const response = await api.get("/delivery", {
          params: { status: "PENDING" },
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!mounted) return
        console.log("response:", response.data)
        setOrders(response.data.data)
      } catch (error) {
        console.error("Erro ao buscar entregas:", error)
      }
    })()

    return () => {
      mounted = false
    }
  }, [token, router, loading])

  console.log("token:", token)

  const handleOpenDetails = (order: ApiOrder) => {
    router.push({
      pathname: "/(tabs)/Delivery/deliveryDetails",
      params: { code: order.code },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Minhas Entregas" />

      <View style={styles.listContainer}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <DeliveryItem item={item} onPress={() => handleOpenDetails(item)} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma entrega disponível</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  listContent: {
    padding: 16,

    flex: 1,
    backgroundColor: colors.secondary,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: colors.text,
    fontSize: 15,
  },
})
