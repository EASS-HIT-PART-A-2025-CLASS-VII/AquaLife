import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import { Label } from '../components/ui/label';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome back to AquaLife!",
      });
    }, 1500);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Welcome to AquaLife! Your account has been created successfully.",
      });
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md glass-panel">
      <Tabs defaultValue="login">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="example@aquamail.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-marine hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-marine-light hover:bg-marine" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" placeholder="example@aquamail.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-marine-light hover:bg-marine" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
          <div className="text-sm text-muted-foreground text-center">
            By continuing, you agree to AquaLife's
          </div>
          <div className="flex justify-center space-x-2 text-sm text-marine">
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>&</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
};
