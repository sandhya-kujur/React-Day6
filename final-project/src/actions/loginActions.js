/**
 * Business logic for authentication actions.
 * Keeping actions separated from components makes the code easier to test and maintain.
 */

export const handleLogin = async (credentials) => {
    try {
        console.log("Starting mock login process...");
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (credentials.username && credentials.password) {
            return { success: true, data: { user: 'OPSMISU' } };
        } else {
            throw new Error("Invalid credentials");
        }

    } catch (error) {
        console.error("Login process failed:", error);
        return { success: false, error: error.message };
    }
};
