export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    token: string;
}

const USERS_KEY = 'neurohealth_users';
const CURRENT_USER_KEY = 'neurohealth_current_user';

export const AuthService = {
    // Simulate backend database
    getUsers: (): User[] => {
        const usersStr = localStorage.getItem(USERS_KEY);
        return usersStr ? JSON.parse(usersStr) : [];
    },

    saveUser: (user: User) => {
        const users = AuthService.getUsers();
        // Check if user exists update, else add
        const existingIndex = users.findIndex(u => u.email === user.email);
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    // Auth actions
    signup: async (name: string, email: string, password: string): Promise<User> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = AuthService.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            token: 'mock-jwt-token-' + Date.now(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=137fec&color=fff`
        };

        AuthService.saveUser(newUser);
        return newUser;
    },

    login: async (email: string, password: string): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = AuthService.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // In a real app we would check password hash
        return user;
    },

    googleLogin: async (): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful Google auth data retrieval
        const googleProfile = {
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };

        const users = AuthService.getUsers();
        let user = users.find(u => u.email === googleProfile.email);

        if (user) {
            // User exists - just return them (login)
            user.token = 'mock-google-token-' + Date.now(); // Refresh token
            // Update avatar if provided (optional in real app, good for mock)
            user.avatar = googleProfile.avatar;
            AuthService.saveUser(user);
        } else {
            // User doesn't exist - register them
            user = {
                id: 'google_' + Date.now(),
                name: googleProfile.name,
                email: googleProfile.email,
                token: 'mock-google-token-' + Date.now(),
                avatar: googleProfile.avatar
            };
            AuthService.saveUser(user);
        }

        return user;
    },

    // Session management
    setCurrentUser: (user: User) => {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Biometric Simulation
    checkBiometricAvailability: async (): Promise<boolean> => {
        if (window.PublicKeyCredential) {
            return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
        return false;
    },

    registerBiometric: async (userId: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate interaction
        // In a real app, this would start navigator.credentials.create()
        // Here we just "mark" this user as having biometric enabled in localStorage
        const key = `neurohealth_bio_${userId}`;
        localStorage.setItem(key, 'true');
        return true;
    },

    verifyBiometric: async (): Promise<User | null> => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate interaction
        // In a real app, this would start navigator.credentials.get()

        // For simulation, we check if *any* user has biometric enabled and return the last logged in user
        // This is a simplification for the demo since we can't know *who* is scanning their finger without the OS telling us the handle
        // We'll rely on the "remembered" user concept for this demo.
        const currentUser = AuthService.getCurrentUser();
        // If we have a current user session (or remembered "last user"), we check their bio status
        // But if we are at login screen, currentUser might be null. 
        // Let's assume for this mock: If a user was previously logged in (stored in Users array), we try to find one with bio enabled.

        const users = AuthService.getUsers();
        // Find a user who has biometric enabled
        const bioUser = users.find(u => localStorage.getItem(`neurohealth_bio_${u.id}`) === 'true');

        return bioUser || null;
    }
};
