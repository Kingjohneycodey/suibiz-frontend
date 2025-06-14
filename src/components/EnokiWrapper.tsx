"use client";
import {
	createNetworkConfig,
	SuiClientProvider,
	useSuiClientContext,
	WalletProvider,
	// WalletProvider,
} from '@mysten/dapp-kit';
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';
import { getFullnodeUrl } from '@mysten/sui/client';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import SessionProvider from './session/page';

const { networkConfig } = createNetworkConfig({
	devnet: { url: getFullnodeUrl('devnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});

type EnokiWrapperProps = {
	children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function EnokiWrapper({ children }: EnokiWrapperProps) {
	return (
		<QueryClientProvider client={queryClient}>
		
				<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
					<RegisterEnokiWallets />
					<WalletProvider autoConnect>
					<SessionProvider>
						{children}
						</SessionProvider>
					</WalletProvider>
				
				</SuiClientProvider>
		
		</QueryClientProvider>
	);
}

function RegisterEnokiWallets() {
	const { client, network } = useSuiClientContext();

	useEffect(() => {
		if (!isEnokiNetwork(network)) return;

		const { unregister } = registerEnokiWallets({
			apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY || '',
			providers: {
				google: {
					clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
					redirectUrl: `${process.env.NEXT_PUBLIC_NEXT_AUTH_URL}/callback`,
				},
			},
			client,
			network,
		});

		return unregister;
	}, [client, network]);

	return null;
}