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

    const exist = session.getItem('@enoki/flow/session/enoki_public_9a3de95df9a16f168ba9ebf1cc36cc1d/devnet')
    console.log("here-->>")
    console.log({ exist })
    return (
        <div>
            { children }
        </div>
    );
}