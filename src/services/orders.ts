import { useState, useEffect } from 'react';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

interface ProductEvent {
  timestamp: number;
  txDigest: string;
  creator?: string;
  order_id?: string;
  seller?: string;
}

interface ProductWithDetails extends ProductEvent {
  data?: Record<string, any>;
}

export const fetchOrders = async (page: number = 1, pageSize: number = 20): Promise<{
  page: number;
  pageSize: number;
  total?: number;
  products?: ProductWithDetails[];
}> => {
  const skip = (page - 1) * pageSize;
  const allEvents: ProductEvent[] = [];
  let cursor: string | null = null;

  try {
    // First, fetch all relevant events with pagination
    while (allEvents.length < skip + pageSize) {
      const response = await client.queryEvents({
        query: {
          MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::OrderCreatedEvent`
        },
        cursor: cursor || undefined,
        limit: Math.min(pageSize * 2, 50), // Fetch more to account for filtering
        order: "descending",
      });

      if (response.data.length === 0) break;

      // Transform events to our ProductEvent format
      for (const event of response.data) {
        const parsed = event.parsedJson as any;

        console.log(parsed)
        allEvents.push({
          timestamp: Number(event.timestampMs || '0'),
          txDigest: event.id.txDigest,
          creator: parsed.creator,
          seller: parsed.seller,
          order_id: parsed.order_id
        });
      }

      cursor = response.nextCursor || null;
      if (!cursor) break;
    }

    // Apply pagination
    const paginatedEvents = allEvents.slice(skip, skip + pageSize);

    // // Then fetch additional details for each product
    const ordersWithDetails = await Promise.all(
      paginatedEvents.map(async (event) => {
        const product: ProductWithDetails = { ...event };

        if (event.order_id) {
          try {
            const objectData = await client.getObject({
              id: event.order_id,
              options: {
                showContent: true,
                showDisplay: true,
                showType: true
              }
            });

            if (objectData.data?.content) {


              if (objectData.data?.content?.fields?.escrow_id) {
                try {

                  const objectData2 = await client.getObject({
                    id: objectData.data?.content?.fields?.escrow_id,
                    options: {
                      showContent: true,
                      showDisplay: true,
                      showType: true
                    }

                  });


                  if (objectData2.data?.content) {
                    console.log(objectData2.data?.content.fields)

                    product.escrow = {
                      ...objectData2.data?.content.fields,
                      id: objectData2.data.objectId,
                    }
                  }

                } catch (error) {
                  console.error(`Failed to fetch object ${event.order_id}:`, error);
                }

              }

              if (objectData.data?.content?.fields?.product_type) {
                try {

                  const objectData2 = await client.getObject({
                    id: objectData.data?.content?.fields?.product_type,
                    options: {
                      showContent: true,
                      showDisplay: true,
                      showType: true
                    }

                  });


                  if (objectData2.data?.content) {
                    console.log(objectData2.data?.content.fields)

                    product.product = {
                      ...objectData2.data?.content.fields,
                      id: objectData2.data.objectId,
                    }
                  }

                } catch (error) {
                  console.error(`Failed to fetch object ${event.order_id}:`, error);
                }

              }


              product.data = {
                ...objectData.data.content.fields,
                // Normalize fields if needed
                id: objectData.data.objectId,
              };
            }
          } catch (error) {
            console.error(`Failed to fetch object ${event.order_id}:`, error);
          }
        }

        console.log(product)

        return product;
      })
    );

    return {
      page,
      pageSize,
      total: allEvents.length,
      products: ordersWithDetails
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to load products');
  }
};