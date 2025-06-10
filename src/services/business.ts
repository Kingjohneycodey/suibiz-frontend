import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { KioskClient, Network } from "@mysten/kiosk";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

const kioskClient = new KioskClient({
  client: client as any,
  network: Network.TESTNET,
});

export async function getAllStores() {
  // 1. Get the registry object
  const registry = await client.getObject({
    id: process.env.NEXT_PUBLIC_STORE_REGISTRY_ID || "",
    options: {
      showContent: true,
    },
  });

  const registryContent = registry.data?.content;
  if (!registryContent || registryContent.dataType !== "moveObject") {
    throw new Error("Invalid Registry object");
  }

  console.log(registryContent.fields)

  // 2. Extract the stores map from registry
  const storesMap =
    (registryContent.fields as any).stores?.fields?.contents || [];

  // 3. Get all store objects
  const storeIds = storesMap.map((item: any) => item.fields.value);

  const stores = await client.multiGetObjects({
    ids: storeIds,
    options: {
      showContent: true,
    },
  });

  // 4. Get associated kiosk info (optional)
  const storesWithKiosks = await Promise.all(
    stores.map(async (store) => {
      const storeContent = store.data?.content;
      if (!storeContent || storeContent.dataType !== "moveObject") {
        return { store: null, kiosk: null };
      }

      const kioskId = (storeContent.fields as any).kiosk_id;
      const kiosk = kioskId
        ? await client.getObject({
            id: kioskId,
            options: { showContent: true },
          })
        : null;

      const kioskContent = kiosk?.data?.content;
      return {
        store: storeContent.fields,
        kiosk:
          kioskContent?.dataType === "moveObject" ? kioskContent.fields : null,
      };
    })
  );

  return storesWithKiosks;
}

export async function getKioskOwnerCaps(address: string) {
  const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
    address,
  });

  return kioskOwnerCaps
}

export async function getSingleKioskCap(address: string, kioskId: string) {
  const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
    address,
  });

  const matchedCap = kioskOwnerCaps.find((cap: any) => cap.kioskId === kioskId);

  return matchedCap;
}

export async function getSingleStore(address: string) {
  // 1. Get the registry object
  const registry = await client.getObject({
    id: process.env.NEXT_PUBLIC_STORE_REGISTRY_ID || "",
    options: {
      showContent: true,
    },
  });

  const registryContent = registry.data?.content;
  if (!registryContent || registryContent.dataType !== "moveObject") {
    throw new Error("Invalid Registry object");
  }

  // 2. Extract the stores map from registry
  const storesMap =
    (registryContent.fields as any).stores?.fields?.contents || [];

  console.log('Stores map:', storesMap);

  // 3. Find the store with matching key
  const matchingStore = storesMap.find((item: any) => item.fields.key === address);
  
  if (!matchingStore) {
    console.log('No store found for address:', address);
    return null;
  }

  const storeId = matchingStore.fields.value;

  // 4. Get the store object
  const store = await client.getObject({
    id: storeId,
    options: {
      showContent: true,
    },
  });

  const storeContent = store.data?.content;
  if (!storeContent || storeContent.dataType !== "moveObject") {
    return { store: null, kiosk: null };
  }

  return storeContent.fields
}

// useEffect(() => {
//   const fetchStores = async () => {
//     const stores = await getAllStores();
//     console.log(stores);
//   };
//   fetchStores();
// }, [])
