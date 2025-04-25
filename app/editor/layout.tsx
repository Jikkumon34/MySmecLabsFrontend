
export default function EditorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
        {/* <Navbar/> */}
        <div > {/* Add padding to the top to avoid overlap with the navbar */}
            {children}
        </div>
        </>

    )
}
