'use client';
import { useEffect, useState } from 'react';
import { WalletProvider } from '@mysten/dapp-kit';

export default function CallbackPage({ children }: { children: React.ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const hashParams = new URLSearchParams(window.location.hash.slice(1));
		const token = hashParams.get('access_token');

		if (token) {
			setAccessToken(token);

            alert("hello")

			// Optional: do something with it
			console.log('Captured access token:', token);
			localStorage.setItem('enoki_token', token);

			setTimeout(() => {
				setReady(true);
			}, 4000);
		}
	}, []);

	if (!ready) {
		return <div>Processing login...</div>;
	}

	return (
		<WalletProvider autoConnect>{children}</WalletProvider>
	);
}
