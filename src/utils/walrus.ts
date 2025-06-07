// walrus utils functions

export async function storeFileToWalrus(file: File, address: string): Promise<string> {
  const walrusUrl = `https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=20&send_object_to=${address}`;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(walrusUrl, {
    method: 'PUT',
    body: file,
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

export async function fetchDataFromWalrus(blobId: string) {
  

  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Walrus aggregator data');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchDataFromWalrusById(blobId: string) {
  

  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-object-id/${blobId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Walrus aggregator data');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchBlobFromWalrus(blobId: string) {
  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Walrus aggregator blob data');
    }

    const blob = await response.blob();

    console.log(blob)
    const objectUrl = URL.createObjectURL(blob);

    return objectUrl;

  } catch (error) {
    console.error('Error fetching blob from Walrus:', error);
    throw error;
  }
}
