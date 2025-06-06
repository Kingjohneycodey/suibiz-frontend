
export async function storeFileToWalrus(file: File, address: string): Promise<string> {
  const walrusUrl = `https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=20&send_object_to=${address}`;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(walrusUrl, {
    method: 'PUT',
    body: file, // Walrus expects raw file binary, not FormData
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to Walrus');
  }

  const result = await response.json();

  console.log(result)

  const blobId = result?.newlyCreated?.blobObject?.blobId || result?.alreadyCertified.blobId


  if (!blobId) {
    throw new Error('blobId missing in Walrus response');
  }

  return blobId;
}

export async function storeDataToWalrus(metadata: Record<string, any>, address: string) {
  const walrusUrl = `https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=20&send_object_to=${address}`;

  const response = await fetch(walrusUrl, {
    method: 'PUT',
    body: JSON.stringify(metadata),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload to Walrus');
  }

  const result = await response.json();

  console.log(result)
  
  const blobId = result?.newlyCreated?.blobObject?.blobId || result?.alreadyCertified.blobId


  if (!blobId) {
    throw new Error('blobId missing in Walrus response');
  }

  return blobId;
}