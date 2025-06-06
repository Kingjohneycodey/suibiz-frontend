import { fetchDataFromWalrus } from '@/utils/walrus';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

const profileRegistryId = "0x627e06cb181c38367c0fbc140c8de7b043ab20dd3291fd0b4118e2dc263e36cf"

export async function getUserProfileInfo(userAddress: string) {
  // Step 1: Get the ProfileRegistry object
  const profileRegistry = await client.getObject({
    id: profileRegistryId,
    options: {
      showContent: true,
    },
  });

  console.log('🔍 ProfileRegistry:', profileRegistry);

  const registryContent = profileRegistry.data?.content;
  if (!registryContent || registryContent.dataType !== 'moveObject') {
    throw new Error('Invalid ProfileRegistry object');
  }

  // Step 2: Get the Table ID from address_to_profile field
  const tableId = (registryContent.fields as any).address_to_profile.fields.id.id;

  // Step 3: Query the ProfileInfo from the Table using the user address
  const profileInfo = await client.getDynamicFieldObject({
    parentId: tableId,
    name: {
      type: 'address',
      value: userAddress,
    },
  });

  console.log('👤 ProfileInfo:', profileInfo);

  const profileData = profileInfo.data?.content?.dataType === 'moveObject' 
    ? (profileInfo.data.content.fields as any).value.fields 
    : null;

  console.log(profileData)
  if (!profileData) {
    console.log('No profile found for address:', userAddress);
    return null;
  }

  const profileId = profileData.id;

  const userProfileObject = await client.getObject({
    id: profileId,
    options: { showContent: true },
  });
    
  const profileFields = userProfileObject.data?.content?.dataType === 'moveObject'
    ? (userProfileObject.data.content.fields as any)
    : null;

  const metadataUri = profileFields?.metadata_uri;

  const metadata = await fetchDataFromWalrus(metadataUri)

  console.log(metadata)



  return metadata
}