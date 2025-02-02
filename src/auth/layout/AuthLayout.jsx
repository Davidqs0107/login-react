export const AuthLayout = ({ title, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-8 border border-gray-300">
                <div>
                    <div className="w-full flex justify-center">
                        <div className="w-48 h-48 relative">
                            <img
                                className="absolute inset-0 w-full h-full object-contain"
                                src="/images/HATRIAPERFIL.jpg"
                                alt="Workflow"
                            />
                            <div
                                className="absolute inset-0 shadow-lg rounded-lg"
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                            ></div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    )
}

