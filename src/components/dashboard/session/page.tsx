"use client";
import { useEffect, useState } from "react";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }
    , []);
    if (!isMounted) {
        return null;
    }


    const session = sessionStorage

    const exist = session.getItem('@enoki/flow/session/enoki_public_e5a1d53741cdbe61403b4c6de297ca10/testnet')
    console.log("here-->>")
    console.log({ exist })
    return (
        <div>
            { children }
        </div>
    );
}