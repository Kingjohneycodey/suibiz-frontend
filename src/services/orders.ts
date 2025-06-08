import { SuiClient, EventId } from "@mysten/sui/client";
import { fetchBlobFromWalrus, fetchDataFromWalrus } from "@/utils/walrus";

const client = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

interface ProductEvent {
  timestamp: number;
  txDigest: string;
  creator?: string;
  order_id?: string;
  seller?: string;
}

interface ProductWithDetails extends ProductEvent {
  data?: Record<string, any>;
  escrow?: Record<string, any>;
  product?: Record<string, any>;
}

export const fetchOrders = async (
  page: number = 1,
  pageSize: number = 20
): Promise<{
  page: number;
  pageSize: number;
  total?: number;
  orders?: any[];
}> => {
  const skip = (page - 1) * pageSize;
  const allEvents: ProductEvent[] = [];
  let cursor: EventId | null = null;

  try {
    // First, fetch all relevant events with pagination
    while (allEvents.length < skip + pageSize) {
      const response = await client.queryEvents({
        query: {
          MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::OrderCreatedEvent`,
        },
        cursor,
        limit: Math.min(pageSize * 2, 50), // Fetch more to account for filtering
        order: "descending",
      });

      if (response.data.length === 0) break;

      // Transform events to our ProductEvent format
      for (const event of response.data) {
        const parsed = event.parsedJson as any;

        allEvents.push({
          timestamp: Number(event.timestampMs || "0"),
          txDigest: event.id.txDigest,
          creator: parsed.creator,
          seller: parsed.seller,
          order_id: parsed.order_id,
        });
      }

      cursor = response.nextCursor || null;
      if (!cursor) break;
    }

    // Apply pagination
    const paginatedEvents = allEvents.slice(skip, skip + pageSize);

    // Then fetch additional details for each order
    const ordersWithDetails = await Promise.all(
      paginatedEvents.map(async (event) => {
        const order: ProductWithDetails = { ...event };

        if (event.order_id) {
          try {
            const objectData = await client.getObject({
              id: event.order_id,
              options: {
                showContent: true,
                showDisplay: true,
                showType: true,
              },
            });

            if (objectData.data?.content) {
              if (objectData.data?.content?.dataType === "moveObject") {
                const fields = (objectData.data.content as any).fields;

                if (fields?.escrow_id) {
                  try {
                    const objectData2 = await client.getObject({
                      id: fields.escrow_id,
                      options: {
                        showContent: true,
                        showDisplay: true,
                        showType: true,
                      },
                    });

                    if (objectData2.data?.content?.dataType === "moveObject") {
                      const escrowFields = (objectData2.data.content as any)
                        .fields;

                      order.escrow = {
                        ...escrowFields,
                        id: objectData2.data.objectId,
                      };
                    }
                  } catch (error) {
                    console.error(
                      `Failed to fetch object ${event.order_id}:`,
                      error
                    );
                  }
                }

                if (fields?.product_type) {
                  try {
                    const objectData2 = await client.getObject({
                      id: fields.product_type,
                      options: {
                        showContent: true,
                        showDisplay: true,
                        showType: true,
                      },
                    });

                    if (objectData2.data?.content?.dataType === "moveObject") {
                      const productFields = (objectData2.data.content as any)
                        .fields;

                       const blobId = productFields.metadata_uri;

                      let metadata = null;
                      let photo = null;
                      if (blobId) {
                        metadata = await fetchDataFromWalrus(blobId);
                        photo = await fetchBlobFromWalrus(metadata.photo);
                      }

                      order.product = {
                        ...productFields,
                        id: objectData2.data.objectId,
                        ...metadata,
                        photo,
                      };
                    }
                  } catch (error) {
                    console.error(
                      `Failed to fetch object ${event.order_id}:`,
                      error
                    );
                  }
                }

                order.data = {
                  ...fields,
                  id: objectData.data.objectId,
                };
              }
            }
          } catch (error) {
            console.error(`Failed to fetch object ${event.order_id}:`, error);
          }
        }
        return order;
      })
    );

    return {
      page,
      pageSize,
      total: allEvents.length,
      orders: ordersWithDetails,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to load orders");
  }
};


export const fetchUserOrders = async (
  address: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  page: number;
  pageSize: number;
  total?: number;
  orders?: any[];
}> => {
  const skip = (page - 1) * pageSize;
  const allEvents: ProductEvent[] = [];
  let cursor: EventId | null = null;

  try {
    // First, fetch all relevant events with pagination
    while (allEvents.length < skip + pageSize) {
      const response = await client.queryEvents({
        query: {
          MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::OrderCreatedEvent`,
        },
        cursor,
        limit: Math.min(pageSize * 2, 50), // Fetch more to account for filtering
        order: "descending",
      });

      if (response.data.length === 0) break;

       const filteredEvents = response.data.filter(event => event.sender === address);

      // Transform events to our ProductEvent format
      for (const event of filteredEvents) {
        const parsed = event.parsedJson as any;



        allEvents.push({
          timestamp: Number(event.timestampMs || "0"),
          txDigest: event.id.txDigest,
          creator: parsed.creator,
          seller: parsed.seller,
          order_id: parsed.order_id,
        });
      }

      cursor = response.nextCursor || null;
      if (!cursor) break;
    }

    // Apply pagination
    const paginatedEvents = allEvents.slice(skip, skip + pageSize);

    // Then fetch additional details for each order
    const ordersWithDetails = await Promise.all(
      paginatedEvents.map(async (event) => {
        const order: ProductWithDetails = { ...event };

        if (event.order_id) {
          try {
            const objectData = await client.getObject({
              id: event.order_id,
              options: {
                showContent: true,
                showDisplay: true,
                showType: true,
              },
            });

            if (objectData.data?.content) {
              if (objectData.data?.content?.dataType === "moveObject") {
                const fields = (objectData.data.content as any).fields;

                if (fields?.escrow_id) {
                  try {
                    const objectData2 = await client.getObject({
                      id: fields.escrow_id,
                      options: {
                        showContent: true,
                        showDisplay: true,
                        showType: true,
                      },
                    });

                    if (objectData2.data?.content?.dataType === "moveObject") {
                      const escrowFields = (objectData2.data.content as any)
                        .fields;

                      order.escrow = {
                        ...escrowFields,
                        id: objectData2.data.objectId,
                      };
                    }
                  } catch (error) {
                    console.error(
                      `Failed to fetch object ${event.order_id}:`,
                      error
                    );
                  }
                }

                if (fields?.product_type) {
                  try {
                    const objectData2 = await client.getObject({
                      id: fields.product_type,
                      options: {
                        showContent: true,
                        showDisplay: true,
                        showType: true,
                      },
                    });

                    if (objectData2.data?.content?.dataType === "moveObject") {
                      const productFields = (objectData2.data.content as any)
                        .fields;

                       const blobId = productFields.metadata_uri;

                      let metadata = null;
                      let photo = null;
                      if (blobId) {
                        metadata = await fetchDataFromWalrus(blobId);
                        photo = await fetchBlobFromWalrus(metadata.photo);
                      }

                      order.product = {
                        ...productFields,
                        id: objectData2.data.objectId,
                        ...metadata,
                        photo,
                      };
                    }
                  } catch (error) {
                    console.error(
                      `Failed to fetch object ${event.order_id}:`,
                      error
                    );
                  }
                }

                order.data = {
                  ...fields,
                  id: objectData.data.objectId,
                };
              }
            }
          } catch (error) {
            console.error(`Failed to fetch object ${event.order_id}:`, error);
          }
        }
        return order;
      })
    );

    return {
      page,
      pageSize,
      total: allEvents.length,
      orders: ordersWithDetails,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to load orders");
  }
};
