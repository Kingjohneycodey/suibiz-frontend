import { fetchBlobFromWalrus, fetchDataFromWalrus } from "@/utils/walrus";
import { getFullnodeUrl, SuiClient, EventId } from "@mysten/sui/client";
import { getSingleStore } from "./business";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

interface ProductEvent {
  timestamp: number;
  txDigest: string;
  objectId?: string;
}

interface ProductWithDetails extends ProductEvent {
  data: Record<string, any>;
}

export const fetchProducts = async (page: number = 1, pageSize: number = 20): Promise<{
  page: number;
  pageSize: number;
  total: number;
  products: ProductWithDetails[];
}> => {
  const skip = (page - 1) * pageSize;
  const allEvents: ProductEvent[] = [];
  let cursor: EventId | null = null;

  try {
    // First, fetch all relevant events with pagination
    while (allEvents.length < skip + pageSize) {
      const response = await client.queryEvents({
        query: { 
          MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ID || ""}::marketplace::ProductCreatedEvent` 
        },
        cursor,
        limit: Math.min(pageSize * 2, 50),
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
          objectId: parsed.product_type_id
        });
      }

      cursor = response.nextCursor || null;
      if (!cursor) break;
    }

    // Apply pagination
    const paginatedEvents = allEvents.slice(skip, skip + pageSize);

    // Then fetch additional details for each product
    const productsWithDetails = await Promise.all(
      paginatedEvents.map(async (event) => {
        const product: ProductWithDetails = { ...event, data: {} };
        
        if (event.objectId) {
          try {
            const objectData = await client.getObject({
              id: event.objectId,
              options: {
                showContent: true,
                showDisplay: true,
                showType: true
              }
            });

            if (objectData.data?.content) {
                if (objectData.data.content.dataType === 'moveObject') {
                    const blobId = (objectData.data.content.fields as any).metadata_uri;
                
                    let metadata = null;
                    let photo = null
                    if (blobId) {
                       metadata = await fetchDataFromWalrus(blobId);
                       photo = await fetchBlobFromWalrus(metadata.photo); 
    
                    }

                    const storeContent = await getSingleStore((objectData.data.content.fields as any).kiosk_id)

                    console.log(storeContent)

                    const storeblobId = (storeContent as any)?.metadata_uri;
                
                    let storeMetadata = null;
                    let storePhoto = null
                    if (storeblobId) {
                      storeMetadata = await fetchDataFromWalrus(storeblobId);

                      console.log(storeMetadata)
                      storePhoto = await fetchBlobFromWalrus(storeMetadata.photo); 
    
                    }




                
                    product.data = {
                      ...objectData.data.content.fields,
                      id: objectData.data.objectId,
                      ...metadata,
                      photo,
                      timestamp: product.timestamp,
                      store: {
                        name: storeMetadata.fullname,
                        photo: storePhoto
                      }
                    };
                }
            }
              
          } catch (error) {
            console.error(`Failed to fetch object ${event.objectId}:`, error);
          }
        }

        return product.data
      })
    );

    return {
      page,
      pageSize,
      total: allEvents.length,
      products: productsWithDetails as []
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to load products');
  }
};


export const fetchCreatorsProducts = async (address: string, page: number = 1, pageSize: number = 20): Promise<{
    page: number;
    pageSize: number;
    total: number;
    products: [];
  }> => {
    const skip = (page - 1) * pageSize;
    const allEvents: ProductEvent[] = [];
    let cursor: EventId | null = null;
  
    try {
      // First, fetch all relevant events with pagination
      while (allEvents.length < skip + pageSize) {
        const response = await client.queryEvents({
          query: { 
            MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ID || ""}::marketplace::ProductCreatedEvent` 
          },
          cursor,
          limit: Math.min(pageSize * 2, 50),
          order: "descending",
        });
  
        if (response.data.length === 0) break;

        const filteredEvents = response.data.filter(event => event.sender === address);
  
        // Transform events to our ProductEvent format
        for (const event of filteredEvents) {
          const parsed = event.parsedJson as any;
  
          console.log(parsed)
          allEvents.push({
            timestamp: Number(event.timestampMs || '0'),
            txDigest: event.id.txDigest,
            objectId: parsed.product_type_id
          });
        }
  
        cursor = response.nextCursor || null;
        if (!cursor) break;
      }
  
      // Apply pagination
      const paginatedEvents = allEvents.slice(skip, skip + pageSize);
  
      // Then fetch additional details for each product
      const productsWithDetails = await Promise.all(
        paginatedEvents.map(async (event) => {
          const product: ProductWithDetails = { ...event, data: {} };
          
          if (event.objectId) {
            try {
              const objectData = await client.getObject({
                id: event.objectId,
                options: {
                  showContent: true,
                  showDisplay: true,
                  showType: true
                }
              });
  
              if (objectData.data?.content) {
                  if (objectData.data.content.dataType === 'moveObject') {
                      const blobId = (objectData.data.content.fields as any).metadata_uri;
                  
                      let metadata = null;
                      let photo = null
                      if (blobId) {
                         metadata = await fetchDataFromWalrus(blobId);
                         photo = await fetchBlobFromWalrus(metadata.photo); 
                         console.log(photo)
                      }
                  
                      product.data = {
                        ...objectData.data.content.fields,
                        id: objectData.data.objectId,
                        ...metadata,
                        photo,
                        timestamp: product.timestamp
                      };
                  }
              }
                
            } catch (error) {
              console.error(`Failed to fetch object ${event.objectId}:`, error);
            }
          }
  
          return product.data
        })
      );
  
      return {
        page,
        pageSize,
        total: allEvents.length,
        products: productsWithDetails as []
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products');
    }
  };

export const fetchSingleProduct = async (productId: string) => {
  try {
    const objectData = await client.getObject({
      id: productId,
      options: {
        showContent: true,
        showDisplay: true,
        showType: true
      }
    });

    if (!objectData.data?.content || objectData.data.content.dataType !== 'moveObject') {
      throw new Error('Invalid product object');
    }

    const blobId = (objectData.data.content.fields as any).metadata_uri;
    let metadata = null;
    let photo = null;

    if (blobId) {
      metadata = await fetchDataFromWalrus(blobId);
      photo = await fetchBlobFromWalrus(metadata.photo);
    }

    const storeContent = await getSingleStore((objectData.data.content.fields as any).kiosk_id);
    const storeblobId = (storeContent as any)?.metadata_uri;
    
    let storeMetadata = null;
    let storePhoto = null;
    
    if (storeblobId) {
      storeMetadata = await fetchDataFromWalrus(storeblobId);
      storePhoto = await fetchBlobFromWalrus(storeMetadata.photo);
    }

    return {
      ...objectData.data.content.fields,
      id: objectData.data.objectId,
      ...metadata,
      photo,
      store: {
        name: storeMetadata?.fullname,
        photo: storePhoto
      }
    };
  } catch (error) {
    console.error('Error fetching single product:', error);
    throw error;
  }
};