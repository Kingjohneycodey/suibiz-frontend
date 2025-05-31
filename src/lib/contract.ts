// import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
// import { TransactionBlock } from '@mysten/sui.js/transactions';

// const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// const tx = new TransactionBlock();
// tx.moveCall({
//     target: '0x7bd80a7a314d908ea37cb7e97af3c6b781a1c400177b73a28abb77d40bc90b5d::module_name::emit_profile_id',
//     arguments: [
//         tx.object('0xdaf1c8b74df2e56f6e43ba7a6aeef3ee92df0d6ef81beb2b78209d500f2f5bd8'), // Your registry object ID
//         // tx.pure('0x<user_address>', 'address'),
//     ],
//     typeArguments: [],
// });

// const result = await client.signAndExecuteTransactionBlock({
//     transactionBlock: tx,
//     signer: myWallet, // Your wallet adapter
//     options: {
//         showEvents: true,
//     },
// });

// // Get profile ID from emitted event
// const event = result.events?.find(
//     (e) => e.type === '0x<package>::module::EventWithID'
// );
// console.log('Profile ID:', event?.parsedJson?.id);
