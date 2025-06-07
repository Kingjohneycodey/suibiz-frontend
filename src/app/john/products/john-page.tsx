"use client";
import React, { useEffect, useState } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

type ProductListedEvent = {
  productId: string;
  owner: string;
  price: number;
  collection: string;
  timestamp: number;
  txDigest: string;
  objectId?: string;
};

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

const MOVE_EVENT_TYPE = '0x0f109a3e96d6890a9ffdd7f2c99953232374139f4f8cfcdd539d4a0d29752ac8::marketplace::ProductListed';

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductListedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchObjectIdFromTransaction(txDigest: string): Promise<string | null> {
    try {
      const tx = await client.getTransactionBlock({ digest: txDigest, options: { showEffects: true } });
      const createdObjects = tx.effects?.created || [];

      const productObject = createdObjects.find(obj =>
        (obj.owner as any)?.ObjectOwner !== undefined || true
      );

      return productObject?.reference.objectId ?? null;
    } catch (err) {
      return null;
    }
  }

  async function fetchAllProductListedEvents() {
    setLoading(true);
    setError(null);
    const allEvents: ProductListedEvent[] = [];
    let cursor: string | null = null;
    const limit = 20;

    try {
      do {
        const response = await client.queryEvents({
          query: { MoveEventType: MOVE_EVENT_TYPE },
          cursor: cursor ? { txDigest: cursor, eventSeq: '0' } : null,
          limit,
          order: 'descending',
        });

        if (response.data.length === 0) break;

        for (const event of response.data) {
          const parsedJson = event.parsedJson as any;
          const priceInSui = Number(parsedJson.price) / 1_000_000_000;

          // Fetch objectId using txDigest
          const objectId = await fetchObjectIdFromTransaction(event.id.txDigest);


          const product: ProductListedEvent = {
            productId: parsedJson.product_id,
            owner: parsedJson.owner,
            price: priceInSui,
            collection: parsedJson.collection,
            timestamp: Number(event.timestampMs),
            txDigest: event.id.txDigest,
            objectId: objectId ?? undefined,
          };

          allEvents.push(product);
        }

        cursor = response.nextCursor?.txDigest || null;
      } while (cursor !== null);

      setProducts(allEvents);
    } catch (err) {
      setError('Failed to load product events. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProductListedEvents();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Marketplace Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && products.length === 0 && !error && <p>No products found.</p>}

      <ul>
        {products.map((product) => (
          <li key={`${product.txDigest}-${product.timestamp}`} style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
            <strong>Product ID:</strong> {product.productId} <br />
            <strong>Owner:</strong> {product.owner} <br />
            <strong>Price:</strong> {product.price.toFixed(2)} SUI <br />
            <strong>Collection:</strong> {product.collection} <br />
            <strong>Object ID:</strong> {product.objectId || 'Unknown'} <br />
            <small>Tx Digest: {product.txDigest}</small><br />
            <small>Timestamp: {new Date(product.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
