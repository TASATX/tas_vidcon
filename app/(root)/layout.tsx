import React, { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from '../../components/Sidebar';

const RootLayout =({ children } : { children: ReactNode }) => {
    return (
        <main>
            <Navbar />

            <Sidebar />

            {children}
            
        </main>
    )
}

export default RootLayout;