import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, LogIn, UserPlus } from 'lucide-react';
import RobbieFace from '@/components/RobbieFace';
import SpeechBubble from '@/components/SpeechBubble';

export default function Login() {
    const { login, signup, authError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await login(email, password);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await signup(email, password, name);
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center mb-8"
            >
                <RobbieFace emotion="happy" speaking={isSpeaking} size="medium" />
                <div className="mt-4 w-full max-w-sm">
                    <SpeechBubble
                        message="Welcome! Please log in or create an account to start your adventure."
                        visible={true}
                        onSpeakStart={() => setIsSpeaking(true)}
                        onSpeakEnd={() => setIsSpeaking(false)}
                    />
                </div>
            </motion.div>

            <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl border-orange-100">
                <Tabs defaultValue="login" className="w-full">
                    <CardHeader>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <CardTitle className="text-xl">Welcome Back!</CardTitle>
                                <CardDescription>Login with your credentials</CardDescription>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {authError?.type === 'login_error' && (
                                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{authError.message}</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="mr-2 w-5 h-5" />}
                                    Login
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignup}>
                            <CardContent className="space-y-4">
                                <CardTitle className="text-xl">Create Account</CardTitle>
                                <CardDescription>Join the Tech Lab! Check your email for confirmation after signing up.</CardDescription>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Your Name</Label>
                                    <Input
                                        id="signup-name"
                                        type="text"
                                        placeholder="Robbie"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {authError?.type === 'signup_error' && (
                                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{authError.message}</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-sky-500 hover:bg-sky-600 h-12 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2 w-5 h-5" />}
                                    Sign Up
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>

            <div className="mt-8 text-gray-500 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Robbie's Tech Lab - Powered by Supabase
            </div>
        </div>
    );
}
